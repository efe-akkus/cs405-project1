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

// A unit cube with a different shade on each face.
export function createCube() {
  const corners = [
    [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, 0.5, -0.5],
    [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, 0.5, 0.5],
  ];
  const faces = [
    [[4, 5, 6, 7], [0.65, 0.33, 0.10]],
    [[1, 0, 3, 2], [0.35, 0.13, 0.04]],
    [[0, 4, 7, 3], [0.46, 0.20, 0.06]],
    [[5, 1, 2, 6], [0.34, 0.14, 0.05]],
    [[7, 6, 2, 3], [0.85, 0.52, 0.19]],
    [[0, 1, 5, 4], [0.28, 0.11, 0.04]],
  ];
  const data = [];
  for (const [indices, color] of faces) {
    for (const index of [0, 1, 2, 0, 2, 3]) {
      data.push(...corners[indices[index]], ...color);
    }
  }
  return { vertices: new Float32Array(data), vertexCount: data.length / 6, stride: 24 };
}
