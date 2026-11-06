// Column-major storage: element (row, column) is at column * 4 + row.
// Matrices act on column vectors, so multiply(a, b) applies b first.

export function identity() {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

export function multiply(a, b) {
  const result = new Float32Array(16);
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      let value = 0;
      for (let k = 0; k < 4; k++) {
        value += a[k * 4 + row] * b[column * 4 + k];
      }
      result[column * 4 + row] = value;
    }
  }
  return result;
}

export function translation(x, y, z) {
  const result = identity();
  result[12] = x;
  result[13] = y;
  result[14] = z;
  return result;
}

export function scale(x, y, z) {
  const result = identity();
  result[0] = x;
  result[5] = y;
  result[10] = z;
  return result;
}

export function rotationX(radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return new Float32Array([
    1, 0, 0, 0,
    0, cosine, sine, 0,
    0, -sine, cosine, 0,
    0, 0, 0, 1,
  ]);
}

export function rotationY(radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return new Float32Array([
    cosine, 0, -sine, 0,
    0, 1, 0, 0,
    sine, 0, cosine, 0,
    0, 0, 0, 1,
  ]);
}

export function rotationZ(radians) {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return new Float32Array([
    cosine, sine, 0, 0,
    -sine, cosine, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ]);
}

export function transpose(matrix) {
  const result = new Float32Array(16);
  for (let column = 0; column < 4; column++) {
    for (let row = 0; row < 4; row++) {
      result[column * 4 + row] = matrix[row * 4 + column];
    }
  }
  return result;
}

// For a rigid transform [R, t; 0, 1], the inverse is [R^T, -R^T t; 0, 1].
export function inverseRigid(matrix) {
  const result = transpose(matrix);
  const x = matrix[12];
  const y = matrix[13];
  const z = matrix[14];
  result[3] = 0;
  result[7] = 0;
  result[11] = 0;
  result[12] = -(result[0] * x + result[4] * y + result[8] * z);
  result[13] = -(result[1] * x + result[5] * y + result[9] * z);
  result[14] = -(result[2] * x + result[6] * y + result[10] * z);
  return result;
}

export function transformVec4(matrix, vector) {
  const [x, y, z, w] = vector;
  return new Float32Array([
    matrix[0] * x + matrix[4] * y + matrix[8] * z + matrix[12] * w,
    matrix[1] * x + matrix[5] * y + matrix[9] * z + matrix[13] * w,
    matrix[2] * x + matrix[6] * y + matrix[10] * z + matrix[14] * w,
    matrix[3] * x + matrix[7] * y + matrix[11] * z + matrix[15] * w,
  ]);
}
