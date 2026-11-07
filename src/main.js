import './style.css';
import { createRenderer } from './render/renderer.js';
import { bindTransformControls } from './ui/transforms.js';
import { createPlatformScene } from './scene/platform.js';
import { bindCameraControls } from './ui/camera.js';
import { bindCurveEditor } from './interaction/curve-editor.js';

const canvas = document.querySelector('#scene');
const status = document.querySelector('#status');
const errorMessage = document.querySelector('#error');
const restart = document.querySelector('#restart');
const rendererName = document.querySelector('#renderer-name');
const resolution = document.querySelector('#resolution');
const frameTime = document.querySelector('#frame-time');
const vertexCount = document.querySelector('#vertex-count');
const transformControls = document.querySelector('#transform-controls');
const getModels = bindTransformControls(
  transformControls,
  document.querySelector('#trs-matrix'),
  document.querySelector('#srt-matrix'),
);
const sceneMode = document.querySelector('#scene-mode');
const hierarchyControls = document.querySelector('#hierarchy-controls');
const matrixComparison = document.querySelector('#matrix-comparison');
const sceneTree = document.querySelector('#scene-tree');
const animateTurntable = document.querySelector('#animate-turntable');
const showAxes = document.querySelector('#show-axes');
const platformScene = createPlatformScene();
const cameraControls = document.querySelector('#camera-controls');
const cameraLabels = document.querySelector('#camera-labels');
const cameraEnabled = () => sceneMode.value === 'camera';
const readCamera = bindCameraControls(canvas, cameraControls, cameraEnabled);
const curveControls = document.querySelector('#curve-controls');
const curvesEnabled = () => sceneMode.value === 'curves';
const readCurves = bindCurveEditor(canvas, curveControls, curvesEnabled);
document.querySelector('#scene-tree-content').textContent = platformScene.tree;

function updateSceneControls() {
  const hierarchy = sceneMode.value === 'hierarchy';
  const transforms = sceneMode.value === 'transforms';
  transformControls.hidden = !transforms;
  matrixComparison.hidden = !transforms;
  cameraControls.hidden = !cameraEnabled();
  curveControls.hidden = !curvesEnabled();
  cameraLabels.hidden = !cameraEnabled();
  canvas.classList.toggle('orbit-enabled', cameraEnabled());
  canvas.classList.toggle('curve-editing', curvesEnabled());
  canvas.classList.toggle('placing-point', curvesEnabled() && document.querySelector('#curve-place').getAttribute('aria-pressed') === 'true');
  hierarchyControls.hidden = !hierarchy;
  sceneTree.hidden = !hierarchy;
}

function getScene(deltaSeconds) {
  if (curvesEnabled()) return { models: [], axes: [] };
  if (sceneMode.value !== 'transforms') {
    return platformScene.frame(deltaSeconds, animateTurntable.checked, showAxes.checked);
  }
  return { models: getModels(), axes: [] };
}

sceneMode.addEventListener('change', updateSceneControls);
updateSceneControls();
let renderer;

function showError(error) {
  status.dataset.state = 'error';
  status.textContent = 'WebGPU unavailable';
  rendererName.textContent = 'Stopped';
  frameTime.textContent = '—';
  vertexCount.textContent = '0';
  errorMessage.textContent = error.message;
  errorMessage.hidden = false;
  console.error(error);
}

async function start() {
  restart.disabled = true;
  renderer?.destroy();
  renderer = undefined;
  status.dataset.state = 'loading';
  status.textContent = 'Connecting to WebGPU…';
  errorMessage.hidden = true;
  try {
    renderer = await createRenderer(canvas, {
      getScene,
      getCurves: (...args) => curvesEnabled() && readCurves(...args),
      getCamera: (aspect, observerAspect) => cameraEnabled() && readCamera(aspect, observerAspect),
      onError: showError,
      onStats: (stats) => {
        vertexCount.textContent = stats.vertexCount;
        resolution.textContent = `${stats.width} × ${stats.height}`;
        frameTime.textContent = stats.intervalMs === null ? '—' : `${stats.intervalMs.toFixed(1)} ms`;
      },
    });
    rendererName.textContent = 'WebGPU';
    status.dataset.state = 'ready';
    status.textContent = 'WebGPU ready';
  } catch (error) {
    showError(error);
  } finally {
    restart.disabled = false;
  }
}

restart.addEventListener('click', start);
if (import.meta.hot) import.meta.hot.dispose(() => renderer?.destroy());
start();
