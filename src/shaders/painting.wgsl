struct Viewport {
  scale: vec4f,
};

@group(0) @binding(0) var<uniform> viewport: Viewport;
@group(0) @binding(1) var paintingTexture: texture_2d<f32>;
@group(0) @binding(2) var paintingSampler: sampler;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vertexMain(@location(0) position: vec3f, @location(1) uv: vec2f) -> VertexOutput {
  var output: VertexOutput;
  output.position = vec4f(position.xy * viewport.scale.xy, position.z, 1.0);
  output.uv = uv;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  // The sRGB texture decodes on sampling; the sRGB render target encodes on output.
  return textureSample(paintingTexture, paintingSampler, input.uv);
}
