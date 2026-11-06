import { inverseRigid, transformVec4 } from './mat4.js';

function subtract(a, b) {
  return a.map((value, index) => value - b[index]);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function normalize(vector) {
  const length = Math.hypot(...vector);
  return vector.map((value) => value / length);
}

export function lookAt(eye, target, up = [0, 1, 0]) {
  const backward = subtract(eye, target);
  if (Math.hypot(...backward) < 1e-8) throw new RangeError('Camera eye and target must differ.');
  const w = normalize(backward);
  let right = cross(up, w);
  // Choose a different reference axis when up cannot define a right vector.
  if (Math.hypot(...right) < 1e-8) right = cross(Math.abs(w[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0], w);
  const u = normalize(right);
  const v = cross(w, u);
  return new Float32Array([
    u[0], v[0], w[0], 0,
    u[1], v[1], w[1], 0,
    u[2], v[2], w[2], 0,
    -dot(u, eye), -dot(v, eye), -dot(w, eye), 1,
  ]);
}

// View space looks down -Z. Near and far map to NDC depth 0 and 1.
export function perspective(fovY, aspect, near, far) {
  const focal = 1 / Math.tan(fovY / 2);
  return new Float32Array([
    focal / aspect, 0, 0, 0,
    0, focal, 0, 0,
    0, 0, far / (near - far), -1,
    0, 0, far * near / (near - far), 0,
  ]);
}

export function orthographic(halfHeight, aspect, near, far) {
  return new Float32Array([
    1 / (halfHeight * aspect), 0, 0, 0,
    0, 1 / halfHeight, 0, 0,
    0, 0, 1 / (near - far), 0,
    0, 0, near / (near - far), 1,
  ]);
}

const planeCorners = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
const edges = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

export function frustumLines(view, projection, near, far) {
  const cameraToWorld = inverseRigid(view);
  const corners = [near, far].flatMap((distance) => {
    const clipW = projection[15] - distance * projection[11];
    return planeCorners.map(([x, y]) => transformVec4(cameraToWorld, [
      x * clipW / projection[0], y * clipW / projection[5], -distance, 1,
    ]));
  });
  return new Float32Array(edges.flatMap((edge) => edge.flatMap((index) => [
    ...corners[index].slice(0, 3), 1, 0.85, 0.04,
  ])));
}
