import { multiply, rotationX, rotationY, scale, translation } from '../math/mat4.js';

export function composeTransforms({ x, y, z, angle, size }) {
  const move = translation(x, y, z);
  const rotate = multiply(rotationY(angle * Math.PI / 180), rotationX(-Math.PI / 9));
  const resize = scale(size, size, size);
  return {
    trs: multiply(multiply(move, rotate), resize),
    srt: multiply(multiply(resize, rotate), move),
  };
}

export const leftModel = multiply(
  translation(-0.93, -0.58, 0.8),
  multiply(rotationY(-0.45), multiply(rotationX(-0.35), scale(0.34, 0.26, 0.34))),
);
export const rightModel = multiply(
  translation(0.93, -0.54, 0.8),
  multiply(rotationY(0.45), multiply(rotationX(-0.35), scale(0.28, 0.45, 0.28))),
);
