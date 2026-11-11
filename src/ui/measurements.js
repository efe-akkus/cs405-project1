function downloadJson(result) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(result, null, 2) + '\n'], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `cs405-measurement-${result.scene.view}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function bindMeasurements(recordButton, saveButton, status, getSceneState) {
  const jsonOutput = document.querySelector('#measurement-json');
  let session;
  let result;
  let locked = [];

  function unlock() {
    for (const [element, disabled] of locked) element.disabled = disabled;
    locked = [];
    recordButton.disabled = false;
  }

  function cancel(message) {
    if (!session) return;
    session = undefined;
    unlock();
    status.textContent = message;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancel('Measurement cancelled because the tab became hidden. Please retry.');
  });
  recordButton.addEventListener('click', () => {
    result = undefined;
    jsonOutput.textContent = "";
    saveButton.disabled = true;
    session = { warmupStart: null, sampleStart: null, samples: [], scene: getSceneState() };
    const controls = document.querySelectorAll('aside fieldset, #scene-mode, #restart');
    locked = [...controls].map((element) => [element, element.disabled]);
    for (const [element] of locked) element.disabled = true;
    recordButton.disabled = true;
    status.textContent = 'Warming up for 3 seconds…';
  });
  saveButton.addEventListener('click', () => { if (result) downloadJson(result); });

  return {
    cancel,
    onFrame({ time, intervalMs, cpuSubmissionMs, width, height, vertexCount, adapter }) {
      if (!session) return;
      if (session.warmupStart === null) session.warmupStart = time;
      if (time - session.warmupStart < 3000) return;
      if (session.sampleStart === null) {
        session.sampleStart = time;
        session.resolution = [width, height];
        session.startedAt = new Date().toISOString();
        return;
      }
      if (width !== session.resolution[0] || height !== session.resolution[1]) {
        cancel('Measurement cancelled because the canvas was resized. Please retry.');
        return;
      }
      session.samples.push({ intervalMs, cpuSubmissionMs, vertexCount });
      const elapsed = time - session.sampleStart;
      status.textContent = `Recording… ${Math.min(30, Math.floor(elapsed / 1000))} / 30 s`;
      if (elapsed < 30000) return;

      const intervals = session.samples.map((sample) => sample.intervalMs).sort((a, b) => a - b);
      const mean = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
      const vertices = session.samples.map((sample) => sample.vertexCount);
      result = {
        startedAt: session.startedAt,
        endedAt: new Date().toISOString(),
        durationMs: elapsed,
        warmupMs: 3000,
        sampleCount: intervals.length,
        scene: session.scene,
        environment: {
          userAgent: navigator.userAgent,
          devicePixelRatio: window.devicePixelRatio,
          canvasResolution: session.resolution,
          adapter,
        },
        metrics: {
          meanFrameIntervalMs: mean(intervals),
          p95FrameIntervalMs: intervals[Math.ceil(intervals.length * 0.95) - 1],
          maxFrameIntervalMs: intervals.at(-1),
          approximateFps: 1000 / mean(intervals),
          meanCpuSubmissionMs: mean(session.samples.map((sample) => sample.cpuSubmissionMs)),
          minVertices: Math.min(...vertices),
          maxVertices: Math.max(...vertices),
        },
        method: 'Foreground requestAnimationFrame intervals. CPU submission measures JavaScript frame encoding through queue.submit. Neither metric is GPU execution time. No long foreground intervals are discarded.',
        samples: session.samples,
      };
      jsonOutput.textContent = JSON.stringify(result, null, 2);
      session = undefined;
      unlock();
      saveButton.disabled = false;
      status.textContent = `Complete · mean ${result.metrics.meanFrameIntervalMs.toFixed(2)} ms · P95 ${result.metrics.p95FrameIntervalMs.toFixed(2)} ms`;
    },
  };
}
