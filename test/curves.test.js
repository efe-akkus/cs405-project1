import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { bezier, bezierTangent, deCasteljau, catmullRom, catmullRomTangent, evaluateCurve, moveControlPoint } from '../src/math/curves.js';
import { initialCurvePoints } from '../src/scene/curve-data.js';

function closePoint(actual, expected, tolerance = 1e-9) {
  for (const key of ['x', 'y']) assert.ok(Math.abs(actual[key] - expected[key]) < tolerance, `${key}: ${actual[key]} != ${expected[key]}`);
}

// Numerical examples: supplied Week06/L1-Mon-Nov02-Curves.html, slides 9, 11, 20.
test('de Casteljau reproduces every level of the lecture midpoint example', () => {
  const points = [{ x: 0, y: 0 }, { x: 2, y: 4 }, { x: 6, y: 4 }, { x: 8, y: 0 }];
  assert.deepEqual(deCasteljau(points, 0.5), [points,
    [{ x: 1, y: 2 }, { x: 4, y: 4 }, { x: 7, y: 2 }],
    [{ x: 2.5, y: 3 }, { x: 5.5, y: 3 }], [{ x: 4, y: 3 }]]);
  closePoint(bezier(points, 0.5), { x: 4, y: 3 });
  closePoint(bezierTangent(points, 0.5), { x: 9, y: 0 });
});

test('cubic endpoints, repeated interpolation and affine invariance agree', () => {
  const points = [{ x: -2, y: 3 }, { x: 4, y: -5 }, { x: 7, y: 2 }, { x: 3, y: 9 }];
  closePoint(bezier(points, 0), points[0]);
  closePoint(bezier(points, 1), points[3]);
  const affine = ({ x, y }) => ({ x: 2 * x - 3 * y + 4, y: x + y - 7 });
  for (const t of [0, 0.1, 0.3, 0.5, 0.9, 1]) {
    closePoint(bezier(points, t), deCasteljau(points, t).at(-1)[0]);
    closePoint(bezier(points.map(affine), t), affine(bezier(points, t)));
  }
});

test('Catmull-Rom matches the lecture midpoint and endpoint tangents', () => {
  const p = [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 0 }, { x: 6, y: 2 }];
  closePoint(catmullRom(p, 0), p[1]);
  closePoint(catmullRom(p, 1), p[2]);
  closePoint(catmullRom(p, 0.5), { x: 3, y: 1 });
  closePoint(catmullRomTangent(p, 0), { x: 2, y: 0 });
  closePoint(catmullRomTangent(p, 1), { x: 2, y: 0 });
});

test('course Bezier conversion agrees with the independent Catmull-Rom polynomial', () => {
  const p = [{ x: -3, y: 7 }, { x: 2, y: -4 }, { x: 5, y: 8 }, { x: -1, y: 3 }];
  for (let i = 0; i <= 50; i++) {
    const t = i / 50;
    const weights = [(-(t ** 3) + 2 * t ** 2 - t) / 2,
      (3 * t ** 3 - 5 * t ** 2 + 2) / 2,
      (-3 * t ** 3 + 4 * t ** 2 + t) / 2, (t ** 3 - t ** 2) / 2];
    const expected = Object.fromEntries(['x', 'y'].map(key => [key, p.reduce((v, point, j) => v + point[key] * weights[j], 0)]));
    closePoint(catmullRom(p, t), expected);
    if (i > 0 && i < 50) {
      const e = 1e-5, before = catmullRom(p, t - e), after = catmullRom(p, t + e);
      closePoint(catmullRomTangent(p, t), { x: (after.x - before.x) / (2 * e), y: (after.y - before.y) / (2 * e) }, 1e-7);
    }
  }
});

test('both C1 joins survive an anchor move and either adjacent handle move', () => {
  for (const [index, destination] of [[3, { x: 0.49, y: 0.20 }], [2, { x: 0.31, y: 0.20 }], [4, { x: 0.65, y: 0.20 }],
    [6, { x: 0.79, y: 0.32 }], [5, { x: 0.74, y: 0.22 }], [7, { x: 0.84, y: 0.42 }]]) {
    const points = moveControlPoint(initialCurvePoints(), index, destination);
    assert.deepEqual(points[index], destination);
    for (const j of [3, 6]) closePoint(bezierTangent(points.slice(j - 3, j + 1), 1), bezierTangent(points.slice(j, j + 4), 0));
  }
});

test('an in-bounds handle is rejected when its C1 mirror would leave the painting', () => {
  const points = initialCurvePoints();
  assert.strictEqual(moveControlPoint(points, 2, { x: 0.97, y: 0.19 }), points);
});

test('piecewise endpoints and normalized export retain the complete trace', () => {
  const points = initialCurvePoints();
  for (const mode of ['bezier', 'catmull-rom']) {
    closePoint(evaluateCurve(points, mode, 0).position, points[0]);
    closePoint(evaluateCurve(points, mode, 1).position, points.at(-1));
    for (const j of [1, 2]) closePoint(evaluateCurve(points, mode, j / 3).position, points[j * 3]);
  }
  const exported = JSON.parse(readFileSync(new URL('../exports/curve.json', import.meta.url)));
  assert.deepEqual(exported.controlPoints, points);
  assert.equal(exported.coordinates.origin, 'bottom-left');
  assert.equal(exported.segments, 3);
});
