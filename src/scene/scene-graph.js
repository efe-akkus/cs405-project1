import { identity, multiply } from '../math/mat4.js';

export function createNode(name, local = identity(), mesh = null, parent = null) {
  const node = { name, local, mesh, parent, children: [], world: identity() };
  if (parent) parent.children.push(node);
  return node;
}

export function updateWorldMatrices(node, parentWorld) {
  node.world = parentWorld ? multiply(parentWorld, node.local) : node.local;
  for (const child of node.children) updateWorldMatrices(child, node.world);
}

export function collectScene(root, showAxes) {
  const models = [];
  const axes = [];

  function visit(node) {
    // Mesh sizing affects the geometry only. Children inherit the node's frame.
    if (node.mesh) models.push(multiply(node.world, node.mesh));
    if (showAxes) axes.push(node.world);
    for (const child of node.children) visit(child);
  }

  visit(root);
  return { models, axes };
}

export function describeTree(node, depth = 0) {
  const line = '  '.repeat(depth) + node.name;
  return [line, ...node.children.map((child) => describeTree(child, depth + 1))].join('\n');
}
