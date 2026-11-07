export function initialCurvePoints() {
  return [
    { x: 0.18, y: 0.40 }, { x: 0.16, y: 0.29 },
    { x: 0.30, y: 0.19 }, { x: 0.48, y: 0.18 },
    { x: 0.66, y: 0.17 }, { x: 0.75, y: 0.21 },
    { x: 0.80, y: 0.31 }, { x: 0.85, y: 0.41 },
    { x: 0.82, y: 0.44 }, { x: 0.80, y: 0.46 },
  ];
}

export function exportCurve(points, mode, paintingInfo) {
  return {
    painting: paintingInfo.title,
    artist: paintingInfo.artist,
    type: mode === 'bezier' ? 'piecewise-cubic-bezier' : 'uniform-catmull-rom',
    coordinates: { units: 'normalized', origin: 'bottom-left', xRange: [0, 1], yRange: [0, 1] },
    segments: (points.length - 1) / 3,
    continuity: 'C1',
    controlPoints: (mode === 'bezier' ? points : points.filter((_, index) => index % 3 === 0))
      .map(({ x, y }) => ({ x, y })),
  };
}
