import objectShader from '../shaders/objects.wgsl?raw';
import { multiply } from '../math/mat4.js';
import { createCube } from './geometry.js';

export async function createObjectPass(device, format, depthStencil, count) {
  const cube = createCube();
  const module = device.createShaderModule({ code: objectShader });
  const pipeline = await device.createRenderPipelineAsync({
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
  });
  const vertexBuffer = device.createBuffer({
    size: cube.vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, cube.vertices);
  const objects = Array.from({ length: count }, () => {
    const buffer = device.createBuffer({
      size: 16 * Float32Array.BYTES_PER_ELEMENT,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const group = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    return { buffer, group };
  });
  return {
    draw(pass, projection, models) {
      pass.setPipeline(pipeline);
      pass.setVertexBuffer(0, vertexBuffer);
      for (const [index, model] of models.entries()) {
        const object = objects[index];
        device.queue.writeBuffer(object.buffer, 0, multiply(projection, model));
        pass.setBindGroup(0, object.group);
        pass.draw(cube.vertexCount);
      }
      return cube.vertexCount * models.length;
    },
    destroy() {
      vertexBuffer.destroy();
      for (const object of objects) object.buffer.destroy();
    },
  };
}
