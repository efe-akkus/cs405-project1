import shader from '../shaders/objects.wgsl?raw';

export async function createCurvePass(device, format, depthStencil) {
  const module = device.createShaderModule({ code: shader });
  const pipeline = await device.createRenderPipelineAsync({
    layout: 'auto',
    vertex: {
      module,
      entryPoint: 'vertexMain',
      buffers: [{
        arrayStride: 24,
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x3' },
          { shaderLocation: 1, offset: 12, format: 'float32x3' },
        ],
      }],
    },
    fragment: { module, entryPoint: 'fragmentMain', targets: [{ format }] },
    primitive: { topology: 'triangle-list' },
    depthStencil: { ...depthStencil, depthCompare: 'always', depthWriteEnabled: false },
  });
  const uniform = device.createBuffer({ size: 64, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
  const group = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{ binding: 0, resource: { buffer: uniform } }],
  });
  let buffer;
  let capacity = 0;
  return {
    draw(pass, projection, vertices) {
      if (vertices.byteLength > capacity) {
        buffer?.destroy();
        capacity = Math.max(4096, vertices.byteLength * 2);
        buffer = device.createBuffer({ size: capacity, usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST });
      }
      device.queue.writeBuffer(buffer, 0, vertices);
      device.queue.writeBuffer(uniform, 0, projection);
      pass.setPipeline(pipeline);
      pass.setBindGroup(0, group);
      pass.setVertexBuffer(0, buffer);
      const count = vertices.length / 6;
      pass.draw(count);
      return count;
    },
    destroy() {
      buffer?.destroy();
      uniform.destroy();
    },
  };
}
