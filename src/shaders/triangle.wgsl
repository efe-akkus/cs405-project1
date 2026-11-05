struct Viewport {
  scale: vec4f,
};

@group(0) @binding(0) var<uniform> viewport: Viewport;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
};

@vertex
fn vertexMain(@location(0) position: vec3f, @location(1) color: vec3f) -> VertexOutput {
  var output: VertexOutput;
  // Keep the triangle's proportions when the canvas is resized.
  output.position = vec4f(position.xy * viewport.scale.xy, position.z, 1.0);
  output.color = color;
  return output;
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  return vec4f(input.color, 1.0);
}
