import { multiply, rotationX, rotationY, scale, translation } from '../math/mat4.js';
import { collectScene, createNode, describeTree, updateWorldMatrices } from './scene-graph.js';

export function createPlatformScene() {
  const root = createNode('Scene', multiply(translation(0, -0.28, 1.03), rotationX(0.32)));
  const table = createNode('Table', translation(0, -0.24, 0), scale(1.7, 0.11, 0.66), root);
  for (const [name, x, z] of [
    ['Front left leg', -0.72, 0.23],
    ['Front right leg', 0.72, 0.23],
    ['Back left leg', -0.72, -0.23],
    ['Back right leg', 0.72, -0.23],
  ]) {
    createNode(name, translation(x, -0.23, z), scale(0.11, 0.36, 0.11), table);
  }
  const platformOffset = translation(0, 0.105, 0);
  const platform = createNode('Turntable', platformOffset, scale(0.88, 0.1, 0.55), table);
  createNode('Small block', translation(-0.27, 0.13, 0), scale(0.19, 0.16, 0.19), platform);
  createNode('Tall block', translation(0.26, 0.20, 0), scale(0.17, 0.30, 0.17), platform);

  let angle = 0.28;
  return {
    tree: describeTree(root),
    frame(deltaSeconds, animate, showAxes) {
      if (animate) angle = (angle + deltaSeconds * 0.8) % (2 * Math.PI);
      platform.local = multiply(platformOffset, rotationY(angle));
      updateWorldMatrices(root);
      return collectScene(root, showAxes);
    },
  };
}
