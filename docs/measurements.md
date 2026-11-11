# Performance measurements

## Current build and environment

All five retained recordings were taken on **11 November 2026** using the current production build served at `http://127.0.0.1:4173/`. The source baseline is `e0677d5`, plus the recorded-JSON display in the measurement panel. [Build provenance](measurements/build.json) records source and bundle SHA-256 fingerprints so the measured working tree can be identified without guessing a future commit hash.

- GPU: Apple M2, 10 GPU cores, verified from macOS hardware information.
- WebGPU adapter: vendor `apple`, architecture `metal-3`; device/description are empty.
- OS: macOS 26.6.2, verified with the system version tool.
- Browser: Codex in-app browser; running Chromium user-agent version `156.0.0.0`. The raw UA is saved in every recording. This is the running test environment, not the version of a separately installed browser. The UA's macOS 10.15.7 value is a compatibility value, not the measured OS version.
- Fixed viewport: 1280 × 900 CSS pixels. Canvas: **980 × 558 backing pixels**, DPR 1, in every run. The temporary viewport override was reset after capture.

## Method

Each run warms up for 3 seconds, then records at least 30 seconds of foreground requestAnimationFrame intervals. The tab remains visible and the canvas resolution is fixed. Hiding the tab or resizing the canvas cancels recording. Every foreground interval is retained, including long ones. P95 uses the nearest-rank percentile; approximate FPS is 1000 / mean interval. The JSON displayed in the application's Recorded JSON section was saved directly to the files below, including all individual samples.

CPU submission time covers JavaScript work from rendering-callback entry through command encoding and queue.submit. It excludes asynchronous GPU execution. Neither browser frame intervals nor CPU submission times are GPU execution times. Display synchronization limits the interpretation of approximately 60 FPS. One recording per scene/mode does not provide repeated-run variance or a cross-device benchmark.

The small live readout uses a separate rolling mean and excludes gaps of 250 ms or longer. The recorder retains all foreground intervals; screenshot readouts are not the 30-second aggregate.

## Conditions

- A: default three objects, TRS, translation (0.28,-0.52,0.9), Y angle 32 degrees, uniform scale 0.4; static scene.
- B: turntable animation and debug axes on.
- C: perspective, 40-degree vertical FOV, default eye/target, near 0.65, far 6.5; turntable animation and axes on. Both viewports and frustum count towards submitted vertices.
- D Bezier: default three-segment C1 contour, animation, debug and de Casteljau on.
- D Catmull-Rom: default anchor knots, animation and debug on. De Casteljau does not render for this mode.

## Results

| Scene | Samples | Mean interval (ms) | P95 (ms) | Max (ms) | Approx. FPS | Mean CPU submission (ms) | Vertices |
|---|---:|---:|---:|---:|---:|---:|---:|
| A - transforms | 1801 | 16.667 | 17.200 | 17.700 | 60.00 | 0.208 | 114 |
| B - hierarchy | 1801 | 16.667 | 17.300 | 17.700 | 60.00 | 0.253 | 348 |
| C - camera | 1801 | 16.667 | 17.100 | 17.700 | 60.00 | 0.239 | 720 |
| D - Bezier | 1800 | 16.667 | 18.300 | 18.800 | 60.00 | 0.875 | 2169 |
| D - Catmull-Rom | 1801 | 16.666 | 18.600 | 18.800 | 60.00 | 0.742 | 1467 |

All five runs remain near the observed 60 FPS cadence. Curves submit more vertices because of the sampled trace and editor/debug geometry. The two curve modes differ in geometry as well as evaluation, so their CPU averages do not isolate the cost of the Catmull-Rom formula. These observations do not establish maximum GPU throughput.

## Raw data

- [A transforms](measurements/transforms.json)
- [B hierarchy](measurements/hierarchy.json)
- [C camera](measurements/camera.json)
- [D Bezier](measurements/curves.json)
- [D Catmull-Rom](measurements/curves-catmull-rom.json)
- [Build provenance](measurements/build.json)

Only this current set is retained in the project. There is no archive of old or exploratory measurements.

## Reproduction

Run npm run build and npm run preview. Use the same viewport/backing resolution and conditions above. Open Performance measurement, click Record 30 seconds and keep the tab visible. After completion, expand Recorded JSON to inspect/copy the full result, or use Save measurement JSON. Confirm the recorded canvasResolution before comparing runs.

See [the screenshot index](screenshots/README.md) for the refreshed evidence images from the same build and capture session.
