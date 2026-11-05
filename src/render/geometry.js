// Interleaved position (x, y, z) and color (r, g, b) for each vertex.
export function createTriangle() {
  const vertices = new Float32Array([
     0.0,  0.6, 0.5,   1.0, 0.25, 0.20,
    -0.6, -0.5, 0.5,   0.2, 0.85, 0.35,
     0.6, -0.5, 0.5,   0.2, 0.40, 1.00,
  ]);
  return { vertices, vertexCount: 3, stride: 6 * Float32Array.BYTES_PER_ELEMENT };
}

// Two counterclockwise triangles with UV (0, 0) at the image's top-left.
export function createQuad() {
  const vertices = new Float32Array([
    -1, -1, 0.5,   0, 1,
     1, -1, 0.5,   1, 1,
     1,  1, 0.5,   1, 0,
    -1, -1, 0.5,   0, 1,
     1,  1, 0.5,   1, 0,
    -1,  1, 0.5,   0, 0,
  ]);
  return { vertices, vertexCount: 6, stride: 5 * Float32Array.BYTES_PER_ELEMENT };
}
