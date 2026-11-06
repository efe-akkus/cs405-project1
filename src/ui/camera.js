import { multiply } from '../math/mat4.js';
import { frustumLines, lookAt, orthographic, perspective } from '../math/camera.js';

const target = [0, -0.12, 0.52];
const observerView = lookAt([6, 4, 6], [0, 0, 1]);
const distance = 4.6;
const near = 0.65;
const far = 6.5;

export function bindCameraControls(canvas, controls, enabled) {
  const projectionMode = controls.querySelector('#projection-mode');
  const fovControl = controls.querySelector('#camera-fov');
  const eyeOutput = controls.querySelector('#camera-eye');
  let yaw = 0.1;
  let pitch = 0.16;
  let pointer = null;
  let cached;

  function invalidate() {
    cached = undefined;
    fovControl.disabled = projectionMode.value !== 'perspective';
    controls.querySelector('#camera-fov-value').value = fovControl.value;
  }

  controls.querySelector('#camera-target').textContent = target.map((value) => value.toFixed(2)).join(', ');
  controls.querySelector('#camera-near').textContent = near.toFixed(2);
  controls.querySelector('#camera-far').textContent = far.toFixed(2);
  controls.addEventListener('input', invalidate);
  controls.querySelector('#camera-reset').addEventListener('click', () => {
    yaw = 0.1;
    pitch = 0.16;
    projectionMode.value = 'perspective';
    fovControl.value = '40';
    invalidate();
  });

  canvas.addEventListener('pointerdown', (event) => {
    const bounds = canvas.getBoundingClientRect();
    if (!enabled() || pointer || event.button !== 0 || event.clientX - bounds.left >= bounds.width / 2) return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener('pointermove', (event) => {
    if (!pointer || event.pointerId !== pointer.id || !enabled()) return;
    yaw = Math.max(-1.15, Math.min(1.15, yaw - (event.clientX - pointer.x) * 0.009));
    pitch = Math.max(-0.65, Math.min(0.85, pitch + (event.clientY - pointer.y) * 0.009));
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    cached = undefined;
  });
  canvas.addEventListener('lostpointercapture', () => { pointer = null; });
  invalidate();

  return (mainAspect, observerAspect) => {
    if (cached?.mainAspect === mainAspect && cached.observerAspect === observerAspect) return cached;
    const horizontalDistance = distance * Math.cos(pitch);
    const eye = [
      target[0] + horizontalDistance * Math.sin(yaw),
      target[1] + distance * Math.sin(pitch),
      target[2] + horizontalDistance * Math.cos(yaw),
    ];
    eyeOutput.textContent = eye.map((value) => value.toFixed(2)).join(', ');
    const view = lookAt(eye, target);
    const fov = fovControl.valueAsNumber * Math.PI / 180;
    const projection = projectionMode.value === 'perspective'
      ? perspective(fov, mainAspect, near, far)
      : orthographic(1.65, mainAspect, near, far);
    const observerProjection = orthographic(4.1 / Math.min(1, observerAspect), observerAspect, 0.1, 25);
    cached = {
      mainAspect,
      observerAspect,
      main: multiply(projection, view),
      observer: multiply(observerProjection, observerView),
      lines: frustumLines(view, projection, near, far),
    };
    return cached;
  };
}
