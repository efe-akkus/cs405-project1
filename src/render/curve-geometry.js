import { deCasteljau, evaluateCurve } from '../math/curves.js';

export function createCurveGeometry(points, mode, parameter, imageAspect, worldPerPixel, selected, construction) {
  const vertices = [];
  const world = ({ x, y }) => ({ x: (2 * x - 1) * imageAspect, y: 2 * y - 1 });
  function vertex(point, color) {
    vertices.push(point.x, point.y, 0.03, ...color);
  }
  function triangle(a, b, c, color) {
    vertex(a, color);
    vertex(b, color);
    vertex(c, color);
  }
  function line(a, b, color, pixels = 1.5) {
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    if (length < 1e-9) return;
    const offset = pixels * worldPerPixel / (2 * length);
    const dx = -(b.y - a.y) * offset;
    const dy = (b.x - a.x) * offset;
    const corners = [
      { x: a.x + dx, y: a.y + dy }, { x: a.x - dx, y: a.y - dy },
      { x: b.x - dx, y: b.y - dy }, { x: b.x + dx, y: b.y + dy },
    ];
    triangle(corners[0], corners[1], corners[2], color);
    triangle(corners[0], corners[2], corners[3], color);
  }
  function circle(point, radius, color) {
    const center = world(point);
    for (let i = 0; i < 12; i++) {
      const angleA = i * Math.PI / 6;
      const angleB = (i + 1) * Math.PI / 6;
      triangle(center,
        { x: center.x + Math.cos(angleA) * radius, y: center.y + Math.sin(angleA) * radius },
        { x: center.x + Math.cos(angleB) * radius, y: center.y + Math.sin(angleB) * radius }, color);
    }
  }

  const shownPoints = points.map((point, index) => ({ point, index }))
    .filter(({ index }) => mode === 'bezier' || index % 3 === 0);
  for (let i = 0; i < shownPoints.length - 1; i++) {
    line(world(shownPoints[i].point), world(shownPoints[i + 1].point), [0.75, 0.75, 0.75], 1);
  }
  let previous = evaluateCurve(points, mode, 0).position;
  for (let i = 1; i <= 192; i++) {
    const next = evaluateCurve(points, mode, i / 192).position;
    line(world(previous), world(next), [1, 0.82, 0.02], 2.5);
    previous = next;
  }
  const current = evaluateCurve(points, mode, parameter);
  if (construction && mode === 'bezier') {
    const levels = deCasteljau(current.controlPoints, current.t).slice(1);
    const colors = [[0.02, 0.55, 1], [0.08, 1, 0.25], [1, 0.15, 0.65]];
    for (const [levelIndex, level] of levels.entries()) {
      for (let i = 0; i < level.length - 1; i++) line(world(level[i]), world(level[i + 1]), colors[levelIndex], 2);
      for (const point of level) circle(point, 3 * worldPerPixel, colors[levelIndex]);
    }
  }
  for (const { point, index } of shownPoints) {
    circle(point, 6 * worldPerPixel, [0.02, 0.02, 0.02]);
    const color = index === selected ? [1, 0.22, 0.02] : index % 3 === 0 ? [0.02, 0.7, 1] : [1, 1, 1];
    circle(point, 4 * worldPerPixel, color);
  }

  // Orient the moving arrow with the analytic tangent in the painting's metric.
  const tangent = { x: current.tangent.x * imageAspect, y: current.tangent.y };
  const length = Math.hypot(tangent.x, tangent.y);
  if (length > 1e-8) {
    const center = world(current.position);
    const dx = tangent.x / length * 11 * worldPerPixel;
    const dy = tangent.y / length * 11 * worldPerPixel;
    triangle(
      { x: center.x + dx, y: center.y + dy },
      { x: center.x - dx * 0.7 - dy * 0.5, y: center.y - dy * 0.7 + dx * 0.5 },
      { x: center.x - dx * 0.7 + dy * 0.5, y: center.y - dy * 0.7 - dx * 0.5 },
      [1, 0.08, 0.02],
    );
  }
  return { vertices: new Float32Array(vertices), current };
}
