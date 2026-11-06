import objectShader from '../shaders/objects.wgsl?raw';
import { multiply } from '../math/mat4.js';
import { createCube } from './geometry.js';

export async function createObjectPass(device, format, depthStencil) {
  const cube = createCube();
  const module = device.createShaderModule({ code: objectShader });
  const descriptor = {
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vertexMain',
      buffers: [{
        arrayStride: cube.stride,
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x3' },
          { shaderLocation: 1, offset: 12, format: 'float32x3' },
        ],
      }],
    },
    fragment: { module, entryPoint: 'fragmentMain', targets: [{ format }] },
    primitive: { topology: 'triangle-list' },
    depthStencil,
  };
  const [pipeline, axesPipeline] = await Promise.all([
    device.createRenderPipelineAsync(descriptor),
    device.createRenderPipelineAsync({
      ...descriptor,
      primitive: { topology: 'line-list' },
      depthStencil: { ...depthStencil, depthCompare: 'always', depthWriteEnabled: false },
    }),
  ]);
  const vertexBuffer = device.createBuffer({
    size: cube.vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, cube.vertices);
  const axisVertices = new Float32Array([
    0, 0, 0,       1, 0.02, 0.02,
    0.19, 0, 0,    1, 0.02, 0.02,
    0, 0, 0,       0.02, 1, 0.02,
    0, 0.19, 0,    0.02, 1, 0.02,
    0, 0, 0,       0.04, 0.32, 1,
    0, 0, 0.19,    0.04, 0.32, 1,
  ]);
  const axisBuffer = device.createBuffer({
    size: axisVertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(axisBuffer, 0, axisVertices);

  const objectSlots = [];
  const axisSlots = [];
  function drawInstances(pass, drawPipeline, vertices, vertexCount, matrices, projection, slots) {
    if (!matrices.length) return 0;
    pass.setPipeline(drawPipeline);
    pass.setVertexBuffer(0, vertices);
    for (const [index, model] of matrices.entries()) {
      if (!slots[index]) {
        const buffer = device.createBuffer({
          size: 16 * Float32Array.BYTES_PER_ELEMENT,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const group = device.createBindGroup({
          layout: drawPipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer } }],
        });
        slots[index] = { buffer, group };
      }
      const { buffer, group } = slots[index];
      device.queue.writeBuffer(buffer, 0, multiply(projection, model));
      pass.setBindGroup(0, group);
      pass.draw(vertexCount);
    }
    return vertexCount * matrices.length;
  }

  return {
    draw(pass, projection, { models, axes }) {
      const objectCount = drawInstances(pass, pipeline, vertexBuffer, cube.vertexCount, models, projection, objectSlots);
      const axisCount = drawInstances(pass, axesPipeline, axisBuffer, axisVertices.length / 6, axes, projection, axisSlots);
      return objectCount + axisCount;
    },
    destroy() {
      vertexBuffer.destroy();
      axisBuffer.destroy();
      for (const slot of [...objectSlots, ...axisSlots]) slot.buffer.destroy();
    },
  };
}
