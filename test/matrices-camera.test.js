import test from 'node:test';
import assert from 'node:assert/strict';
import { identity, multiply, translation, scale, rotationX, rotationY, rotationZ, transpose, inverseRigid, transformVec4 } from '../src/math/mat4.js';
import { lookAt, perspective, orthographic, frustumLines } from '../src/math/camera.js';
import { createPlatformScene } from '../src/scene/platform.js';

function close(actual, expected, tolerance = 1e-5) {
  assert.equal(actual.length, expected.length);
  actual.forEach((v, i) => assert.ok(Math.abs(v - expected[i]) < tolerance, `${i}: ${v} != ${expected[i]}`));
}

test('TRS and SRT give different manually computed origins', () => {
  const T = translation(2, 3, 0), R = rotationZ(Math.PI / 2), S = scale(2, 2, 2);
  close(transformVec4(multiply(multiply(T, R), S), [0, 0, 0, 1]), [2, 3, 0, 1]);
  close(transformVec4(multiply(multiply(S, R), T), [0, 0, 0, 1]), [-6, 4, 0, 1]);
  close(transformVec4(T, [1, 2, 3, 0]), [1, 2, 3, 0]);
});

test('matrix rotation agrees with course yaw-then-pitch vector rotation', () => {
  // Independent vector-form oracle adapted from V3.rot, Week06/demos/w6b.js.
  const yaw = 0.6, pitch = -0.3, [x, y, z] = [2, -1, 3];
  const rx = Math.cos(yaw) * x + Math.sin(yaw) * z;
  const rz = -Math.sin(yaw) * x + Math.cos(yaw) * z;
  const expected = [rx, Math.cos(pitch) * y - Math.sin(pitch) * rz,
    Math.sin(pitch) * y + Math.cos(pitch) * rz, 0];
  close(transformVec4(multiply(rotationX(pitch), rotationY(yaw)), [x, y, z, 0]), expected);
});

test('rigid inverse reverses mixed rotation and translation in both directions', () => {
  const M = multiply(translation(3, -4, 2), multiply(rotationZ(0.7), multiply(rotationX(-0.3), rotationY(0.4))));
  close(multiply(M, inverseRigid(M)), identity());
  close(multiply(inverseRigid(M), M), identity());
  close(transpose(transpose(M)), M);
});

test('lookAt maps the eye to origin and the target onto negative Z', () => {
  const eye = [2, 3, 4], target = [-1, 0, 2], V = lookAt(eye, target);
  close(transformVec4(V, [...eye, 1]), [0, 0, 0, 1]);
  close(transformVec4(V, [...target, 1]), [0, 0, -Math.hypot(3, 3, 2), 1]);
  const fallback = lookAt([0, 2, 0], [0, 0, 0], [0, 1, 0]);
  assert.ok([...fallback].every(Number.isFinite));
  close(multiply(fallback, inverseRigid(fallback)), identity());
  assert.throws(() => lookAt([0, 0, 0], [0, 0, 0]), RangeError);
});

test('both WebGPU projections and their world frusta agree at all clip corners', () => {
  const near = 0.65, far = 6.5, V = lookAt([2, 3, 4], [0, 0, 0]);
  for (const P of [perspective(Math.PI / 3, 1.5, near, far), orthographic(1.65, 1.5, near, far)]) {
    for (const [z, expected] of [[-near, 0], [-far, 1]]) {
      const q = transformVec4(P, [0, 0, z, 1]);
      close([q[2] / q[3]], [expected]);
    }
    const vertices = frustumLines(V, P, near, far), PV = multiply(P, V);
    assert.equal(vertices.length, 12 * 2 * 6);
    const corners = new Set();
    for (let i = 0; i < vertices.length; i += 6) {
      const q = transformVec4(PV, [...vertices.slice(i, i + 3), 1]);
      const ndc = q.slice(0, 3).map(v => v / q[3]);
      close([Math.abs(ndc[0]), Math.abs(ndc[1])], [1, 1]);
      assert.ok(Math.abs(ndc[2]) < 1e-5 || Math.abs(ndc[2] - 1) < 1e-5);
      corners.add(ndc.map(v => Math.round(v)).join(','));
    }
    assert.equal(corners.size, 8);
  }
});

test('scene traversal, leaf origin, animation inheritance and reset agree', () => {
  const scene = createPlatformScene(), initial = scene.frame(0, false, true);
  assert.equal(initial.models.length, 8);
  assert.equal(initial.axes.length, 9);
  assert.equal(scene.tree.split('\n').length, 9);
  close([...initial.models.at(-2)].slice(12, 15), [-0.2594849683, -0.3082178835, 1.0992553410]);
  const moved = scene.frame(0.1, true, true);
  assert.notDeepEqual([...moved.models.at(-1)], [...initial.models.at(-1)]);
  close(moved.models[0], initial.models[0]);
  assert.equal(scene.frame(0, false, false).axes.length, 0);
  scene.reset();
  close(scene.frame(0, false, true).models.at(-1), initial.models.at(-1));
});
