// WebGPU setup follows the device/context/pass structure in Week04/lab3-starter/main.js.
import paintingShader from '../shaders/painting.wgsl?raw';
import { createPainting } from './painting.js';
import { createObjectPass } from './objects.js';
import { createCurvePass } from './curves.js';
import { multiply, scale } from '../math/mat4.js';
export async function createRenderer(canvas, { getScene, getCamera, getCurves, onFrame, onError, onStats }) {
  if (!window.isSecureContext) {
    throw new Error('Open the application through localhost or HTTPS to use WebGPU.');
  }
  if (!navigator.gpu) {
    throw new Error('WebGPU is not available in this browser. Try a current browser with WebGPU support.');
  }
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) throw new Error('No WebGPU adapter was found. Check browser and graphics support.');
  const device = await adapter.requestDevice();
  const adapterDetails = {
    vendor: adapter.info.vendor,
    architecture: adapter.info.architecture,
    device: adapter.info.device,
    description: adapter.info.description,
  };
  const context = canvas.getContext('webgpu');
  if (!context) {
    device.destroy();
    throw new Error('Could not create a WebGPU canvas context.');
  }
  const format = navigator.gpu.getPreferredCanvasFormat();
  const outputFormat = `${format}-srgb`;
  try {
    context.configure({ device, format, viewFormats: [outputFormat], alphaMode: 'opaque' });
  } catch (error) {
    device.destroy();
    throw error;
  }

  const depthStencil = { format: 'depth24plus', depthWriteEnabled: true, depthCompare: 'less' };
  let objectPass;
  let curvePass;
  let painting;
  let pipeline;
  try {
    painting = await createPainting(device);
    const module = device.createShaderModule({ label: 'Painting shader', code: paintingShader });
    pipeline = await device.createRenderPipelineAsync({
      label: 'Textured painting pipeline',
      layout: 'auto',
      vertex: {
        module,
        entryPoint: 'vertexMain',
        buffers: [{
          arrayStride: painting.geometry.stride,
          attributes: [
            { shaderLocation: 0, offset: 0, format: 'float32x3' },
            { shaderLocation: 1, offset: 12, format: 'float32x2' },
          ],
        }],
      },
      fragment: { module, entryPoint: 'fragmentMain', targets: [{ format: outputFormat }] },
      primitive: { topology: 'triangle-list' },
      depthStencil,
    });
    objectPass = await createObjectPass(device, outputFormat, depthStencil);
    curvePass = await createCurvePass(device, outputFormat, depthStencil);
  } catch (error) {
    objectPass?.destroy();
    painting?.texture.destroy();
    context.unconfigure();
    device.destroy();
    throw error;
  }
  const geometry = painting.geometry;
  const vertexBuffer = device.createBuffer({
    label: 'Painting quad vertices',
    size: geometry.vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, geometry.vertices);
  const paintingView = painting.texture.createView();
  const paintingBindings = Array.from({ length: 2 }, () => {
    const buffer = device.createBuffer({
      label: 'Painting model-to-clip matrix',
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const group = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer } },
        { binding: 1, resource: paintingView },
        { binding: 2, resource: painting.sampler },
      ],
    });
    return { buffer, group };
  });
  const imageAspect = painting.width / painting.height;
  const paintingModel = scale(imageAspect, 1, 1);

  // The painting sits at clip depth 0.5. Positive world Z is closer to the viewer.
  const projection = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, -0.2, 0,
    0, 0, 0.5, 1,
  ]);
  let depthTexture;
  let stopped = false;
  let animationId = 0;
  let previousTime = null;
  let lastReport = -Infinity;
  let intervals = [];

  function stop() {
    stopped = true;
    cancelAnimationFrame(animationId);
  }
  function fail(error) {
    if (stopped) return;
    stop();
    onError(error);
  }
  device.lost.then((info) => {
    if (!stopped) fail(new Error(`GPU connection lost: ${info.message || info.reason}. Restart the renderer to reconnect.`));
  });
  device.addEventListener('uncapturederror', (event) => fail(new Error(event.error.message)));

  function frame(time) {
    if (stopped) return;
    try {
      const cpuStart = performance.now();
      // Match the physical canvas size to its CSS size and the display density.
      const bounds = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const limit = device.limits.maxTextureDimension2D;
      const width = Math.max(1, Math.min(limit, Math.round(bounds.width * dpr)));
      const height = Math.max(1, Math.min(limit, Math.round(bounds.height * dpr)));
      if (!depthTexture || canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        depthTexture?.destroy();
        depthTexture = device.createTexture({
          size: [width, height],
          format: depthStencil.format,
          usage: GPUTextureUsage.RENDER_ATTACHMENT,
        });
      }
      const encoder = device.createCommandEncoder({ label: 'Scene encoder' });
      const pass = encoder.beginRenderPass({
        label: 'Draw scene',
        depthStencilAttachment: {
          view: depthTexture.createView(),
          depthClearValue: 1,
          depthLoadOp: 'clear',
          depthStoreOp: 'discard',
        },
        colorAttachments: [{
          view: context.getCurrentTexture().createView({ format: outputFormat }),
          clearValue: { r: 0.09, g: 0.185, b: 0.265, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        }],
      });
      const deltaSeconds = previousTime === null ? 0 : Math.min(0.05, (time - previousTime) / 1000);
      const scene = getScene(deltaSeconds);
      function drawView(index, x, viewportWidth, viewProjection) {
        pass.setViewport(x, 0, viewportWidth, height, 0, 1);
        pass.setScissorRect(x, 0, viewportWidth, height);
        const { buffer, group } = paintingBindings[index];
        device.queue.writeBuffer(buffer, 0, multiply(viewProjection, paintingModel));
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, group);
        pass.setVertexBuffer(0, vertexBuffer);
        pass.draw(geometry.vertexCount);
        return geometry.vertexCount + objectPass.draw(pass, viewProjection, scene, index);
      }

      const leftWidth = Math.floor((width - 1) / 2);
      const rightWidth = width - leftWidth - 1;
      const camera = leftWidth > 0 && getCamera(leftWidth / height, rightWidth / height);
      let submittedVertices;
      if (camera) {
        submittedVertices = drawView(0, 0, leftWidth, camera.main);
        submittedVertices += drawView(1, leftWidth + 1, rightWidth, camera.observer);
        submittedVertices += objectPass.drawFrustum(pass, camera.observer, camera.lines);
      } else {
        const aspect = width / height;
        projection[0] = 0.9 * Math.min(1 / imageAspect, 1 / aspect);
        projection[5] = projection[0] * aspect;
        submittedVertices = drawView(0, 0, width, projection);
        const curveVertices = getCurves(imageAspect, deltaSeconds, projection);
        if (curveVertices) submittedVertices += curvePass.draw(pass, projection, curveVertices);
      }
      pass.end();
      device.queue.submit([encoder.finish()]);
      const cpuSubmissionMs = performance.now() - cpuStart;
      onFrame({
        time,
        intervalMs: previousTime === null ? 0 : time - previousTime,
        cpuSubmissionMs,
        width,
        height,
        vertexCount: submittedVertices,
        adapter: adapterDetails,
      });

      // Ignore long gaps caused by background tabs; this is not a GPU timer.
      if (previousTime !== null && time - previousTime < 250) intervals.push(time - previousTime);
      previousTime = time;
      if (time - lastReport >= 500) {
        const intervalMs = intervals.length ? intervals.reduce((sum, value) => sum + value, 0) / intervals.length : null;
        onStats({ width, height, intervalMs, vertexCount: submittedVertices });
        intervals = [];
        lastReport = time;
      }
      animationId = requestAnimationFrame(frame);
    } catch (error) {
      fail(error);
    }
  }
  animationId = requestAnimationFrame(frame);

  return {
    destroy() {
      stop();
      vertexBuffer.destroy();
      for (const binding of paintingBindings) binding.buffer.destroy();
      objectPass.destroy();
      curvePass.destroy();
      depthTexture?.destroy();
      painting.texture.destroy();
      context.unconfigure();
      device.destroy();
    },
  };
}
