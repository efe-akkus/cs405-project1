@group(0) @binding(0) var<uniform> modelToClip: mat4x4f;

struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
};

@vertex
fn vertexMain(@location(0) position: vec3f, @location(1) color: vec3f) -> VertexOutput {
  return VertexOutput(modelToClip * vec4f(position, 1.0), color);
}

@fragment
fn fragmentMain(input: VertexOutput) -> @location(0) vec4f {
  return vec4f(input.color, 1.0);
}
