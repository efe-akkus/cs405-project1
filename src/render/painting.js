import { createQuad } from './geometry.js';

// Image source: Week01/assets/kavunlu.js in the supplied CS405 course materials.
export const paintingInfo = {
  title: 'Kavunlu Natürmort',
  artist: 'Şeker Ahmed Paşa',
  url: `${import.meta.env.BASE_URL}assets/kavunlu.jpg`,
};

export async function createPainting(device) {
  const response = await fetch(paintingInfo.url);
  if (!response.ok) throw new Error(`Could not load the painting (${response.status}).`);
  const bitmap = await createImageBitmap(await response.blob());
  const { width, height } = bitmap;
  if (Math.max(width, height) > device.limits.maxTextureDimension2D) {
    bitmap.close();
    throw new Error('The painting image exceeds the GPU texture size limit.');
  }
  let texture;
  try {
    texture = device.createTexture({
      label: 'Painting texture',
      size: [width, height],
      // Texture sampling decodes the stored sRGB image into linear colors.
      format: 'rgba8unorm-srgb',
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
    });
    device.queue.copyExternalImageToTexture({ source: bitmap }, { texture }, [width, height]);
  } catch (error) {
    texture?.destroy();
    throw error;
  } finally {
    bitmap.close();
  }
  const sampler = device.createSampler({
    label: 'Painting sampler',
    magFilter: 'linear',
    minFilter: 'linear',
    addressModeU: 'clamp-to-edge',
    addressModeV: 'clamp-to-edge',
  });
  return { geometry: createQuad(), texture, sampler, width, height };
}
