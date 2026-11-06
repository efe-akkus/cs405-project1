import './style.css';
import { createRenderer } from './render/renderer.js';
import { bindTransformControls } from './ui/transforms.js';

const canvas = document.querySelector('#scene');
const status = document.querySelector('#status');
const errorMessage = document.querySelector('#error');
const restart = document.querySelector('#restart');
const rendererName = document.querySelector('#renderer-name');
const resolution = document.querySelector('#resolution');
const frameTime = document.querySelector('#frame-time');
const vertexCount = document.querySelector('#vertex-count');
const getModels = bindTransformControls(
  document.querySelector('#transform-controls'),
  document.querySelector('#trs-matrix'),
  document.querySelector('#srt-matrix'),
);
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
      getModels,
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
