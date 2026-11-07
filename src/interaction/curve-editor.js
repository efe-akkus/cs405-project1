import { moveControlPoint } from '../math/curves.js';
import { initialCurvePoints, exportCurve } from '../scene/curve-data.js';
import { paintingInfo } from '../render/painting.js';
import { createCurveGeometry } from '../render/curve-geometry.js';

export function bindCurveEditor(canvas, controls, enabled) {
  const mode = controls.querySelector('#curve-mode');
  const parameter = controls.querySelector('#curve-parameter');
  const animate = controls.querySelector('#animate-curve');
  const construction = controls.querySelector('#show-construction');
  const selection = controls.querySelector('#curve-selection');
  const place = controls.querySelector('#curve-place');
  const feedback = controls.querySelector('#curve-feedback');
  let points = initialCurvePoints();
  let selected = 0;
  let placing = false;
  let pointer = null;
  let imageAspect;

  for (let i = 0; i < points.length; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `P${i} · ${i % 3 === 0 ? 'anchor' : 'handle'}`;
    selection.append(option);
  }

  function update() {
    for (const option of selection.options) option.hidden = mode.value !== 'bezier' && Number(option.value) % 3 !== 0;
    if (mode.value !== 'bezier' && selected % 3 !== 0) selected = Math.floor(selected / 3) * 3;
    selection.value = selected;
    construction.disabled = mode.value !== 'bezier';
    place.setAttribute('aria-pressed', String(placing));
    canvas.classList.toggle('placing-point', placing && enabled());
    controls.querySelector('#curve-parameter-value').value = Number(parameter.value).toFixed(3);
  }

  controls.addEventListener('input', (event) => {
    if (event.target === selection) selected = Number(selection.value);
    if (event.target === parameter) animate.checked = false;
    update();
  });
  place.addEventListener('click', () => { placing = !placing; update(); });
  controls.querySelector('#curve-reset').addEventListener('click', () => {
    points = initialCurvePoints();
    selected = 0;
    parameter.value = '0.3';
    animate.checked = false;
    placing = false;
    feedback.textContent = '';
    update();
  });
  controls.querySelector('#curve-export').addEventListener('click', () => {
    const json = JSON.stringify(exportCurve(points, mode.value, paintingInfo), null, 2);
    const url = URL.createObjectURL(new Blob([json + '\n'], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'curve.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  function screenPoint(event) {
    if (!imageAspect) return null;
    const bounds = canvas.getBoundingClientRect();
    const aspect = canvas.width / canvas.height;
    const scaleX = 0.9 * Math.min(1 / imageAspect, 1 / aspect);
    const scaleY = scaleX * aspect;
    return {
      x: ((event.clientX - bounds.left) / bounds.width * 2 - 1) / (scaleX * imageAspect) / 2 + 0.5,
      y: (1 - (event.clientY - bounds.top) / bounds.height * 2) / scaleY / 2 + 0.5,
    };
  }

  function move(destination) {
    const next = moveControlPoint(points, selected, destination);
    feedback.textContent = next === points ? 'Keep the point and its mirrored handles inside the painting.' : '';
    points = next;
  }

  canvas.addEventListener('pointerdown', (event) => {
    if (!enabled() || event.button !== 0 || pointer !== null) return;
    const position = screenPoint(event);
    if (!position || position.x < 0 || position.x > 1 || position.y < 0 || position.y > 1) return;
    if (placing) {
      move(position);
      placing = false;
    } else {
      const bounds = canvas.getBoundingClientRect();
      const aspect = canvas.width / canvas.height;
      const imageHeight = bounds.height * 0.9 * Math.min(1, aspect / imageAspect);
      const imageWidth = imageHeight * imageAspect;
      let closest = -1;
      let distance = 12;
      for (const [index, point] of points.entries()) {
        if (mode.value !== 'bezier' && index % 3 !== 0) continue;
        const pixels = Math.hypot((point.x - position.x) * imageWidth, (point.y - position.y) * imageHeight);
        if (pixels < distance) { closest = index; distance = pixels; }
      }
      if (closest < 0) return;
      selected = closest;
    }
    pointer = event.pointerId;
    canvas.setPointerCapture(pointer);
    update();
  });
  canvas.addEventListener('pointermove', (event) => {
    if (pointer !== event.pointerId || !enabled()) return;
    move(screenPoint(event));
  });
  canvas.addEventListener('lostpointercapture', () => { pointer = null; });
  update();

  return (paintingAspect, deltaSeconds, projection) => {
    imageAspect = paintingAspect;
    if (animate.checked) parameter.value = (Number(parameter.value) + deltaSeconds * 0.06) % 1;
    const bounds = canvas.getBoundingClientRect();
    const worldPerPixel = 2 / (bounds.height * projection[5]);
    const result = createCurveGeometry(points, mode.value, Number(parameter.value), imageAspect,
      worldPerPixel, selected, construction.checked);
    const { current } = result;
    controls.querySelector('#curve-parameter-value').value = Number(parameter.value).toFixed(3);
    controls.querySelector('#curve-position').textContent = `(${current.position.x.toFixed(3)}, ${current.position.y.toFixed(3)})`;
    controls.querySelector('#curve-segment').textContent = `${current.segment + 1} / 3, local t = ${current.t.toFixed(3)}`;
    return result.vertices;
  };
}
