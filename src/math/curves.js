export function lerpPoint(a, b, t) {
  return { x: (1 - t) * a.x + t * b.x, y: (1 - t) * a.y + t * b.y };
}

export function bezier(points, t) {
  const u = 1 - t;
  const weights = [u ** 3, 3 * u * u * t, 3 * u * t * t, t ** 3];
  return {
    x: points.reduce((sum, point, index) => sum + weights[index] * point.x, 0),
    y: points.reduce((sum, point, index) => sum + weights[index] * point.y, 0),
  };
}

export function bezierTangent(points, t) {
  const u = 1 - t;
  const weights = [3 * u * u, 6 * u * t, 3 * t * t];
  return {
    x: weights.reduce((sum, weight, index) => sum + weight * (points[index + 1].x - points[index].x), 0),
    y: weights.reduce((sum, weight, index) => sum + weight * (points[index + 1].y - points[index].y), 0),
  };
}

export function deCasteljau(points, t) {
  const levels = [points];
  while (levels.at(-1).length > 1) {
    const previous = levels.at(-1);
    levels.push(previous.slice(0, -1).map((point, index) => lerpPoint(point, previous[index + 1], t)));
  }
  return levels;
}

// Adapted from C6.crBez in the supplied Week06/demos/w6a.js.
// Central-difference tangents become cubic Bezier handles at one third length.
function catmullRomControls([p0, p1, p2, p3]) {
  return [
    p1,
    { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 },
    { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 },
    p2,
  ];
}

// Uniform Catmull-Rom interpolates p1 and p2 at t = 0 and t = 1.
export function catmullRom(points, t) {
  return bezier(catmullRomControls(points), t);
}

export function catmullRomTangent(points, t) {
  return bezierTangent(catmullRomControls(points), t);
}

export function evaluateCurve(points, mode, parameter) {
  const segmentCount = (points.length - 1) / 3;
  const scaled = Math.max(0, Math.min(1, parameter)) * segmentCount;
  const segment = Math.min(segmentCount - 1, Math.floor(scaled));
  const t = scaled - segment;
  if (mode === 'bezier') {
    const controlPoints = points.slice(segment * 3, segment * 3 + 4);
    return { position: bezier(controlPoints, t), tangent: bezierTangent(controlPoints, t), controlPoints, segment, t };
  }
  const knots = points.filter((_, index) => index % 3 === 0);
  const controlPoints = [-1, 0, 1, 2].map((offset) => knots[Math.max(0, Math.min(knots.length - 1, segment + offset))]);
  return { position: catmullRom(controlPoints, t), tangent: catmullRomTangent(controlPoints, t), controlPoints, segment, t };
}

// Equal-duration Bézier segments share equal derivatives when the handles mirror.
export function moveControlPoint(points, index, destination) {
  const moved = points.map((point) => ({ ...point }));
  const delta = { x: destination.x - moved[index].x, y: destination.y - moved[index].y };
  moved[index] = { ...destination };
  if (index % 3 === 0) {
    for (const handle of [index - 1, index + 1]) {
      if (moved[handle]) {
        moved[handle].x += delta.x;
        moved[handle].y += delta.y;
      }
    }
  } else {
    const knot = index % 3 === 1 ? index - 1 : index + 1;
    const mirror = 2 * knot - index;
    if (knot > 0 && knot < points.length - 1) {
      moved[mirror] = { x: 2 * moved[knot].x - destination.x, y: 2 * moved[knot].y - destination.y };
    }
  }
  return moved.every(({ x, y }) => x >= 0 && x <= 1 && y >= 0 && y <= 1) ? moved : points;
}
