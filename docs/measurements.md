# Performance measurements

## Environment

- Recorded on 8 November 2026 (Istanbul time), using the production Vite build served at `http://127.0.0.1:4173/`.
- GPU: Apple M2, 10 GPU cores (macOS hardware information). WebGPU adapter reports vendor `apple`, architecture `metal-3`; device and description fields are empty.
- Operating system: macOS 26.6.2.
- Browser: Google Chrome 156.0.8078.80. The browser user-agent reduces the version to 156.0.0.0 and reports a compatibility macOS version; the full version and OS above were read from the installed application and system.
- Canvas backing resolution: 2200 × 1145 pixels for all four runs; device pixel ratio: 2.
- Application baseline: commit `65c7c1b`, with the measurement controls added in the working tree.

## Method

Each run uses a 3-second warm-up followed by at least 30 seconds of foreground `requestAnimationFrame` intervals. The tab stays visible and the window size remains unchanged. Controls are disabled during recording. A hidden tab or changed canvas resolution cancels the run. Every recorded foreground interval is retained, including long intervals. P95 uses the nearest-rank percentile. Approximate FPS is 1000 divided by the mean interval.

CPU submission time covers JavaScript work from the start of the rendering callback through command encoding and `queue.submit`. It excludes asynchronous GPU execution and is not a GPU timer. Frame intervals include browser scheduling and display synchronization, so a result close to 60 FPS does not establish the maximum GPU throughput. Each scene has one retained run; these are observations on this machine, not a statistical benchmark across devices.

The live half-second readout excludes gaps of 250 ms or longer. The 30-second recorder deliberately uses a separate sample list and does not discard those intervals. Screenshots show the live readout, not the summary of the retained run.

## Scene conditions

- **Transforms:** default middle object, TRS order, three objects and painting; no animation.
- **Hierarchy:** turntable animation on, local axes on; painting and hierarchical table/blocks.
- **Camera:** perspective, 40° vertical FOV, default orbit position; animated scene and axes on. Both viewports and the yellow frustum are rendered.
- **Curves:** default three-segment C1 Bézier trace, curve animation on, debug drawings and de Casteljau on. The retained run submitted 2169 vertices per frame.

All exact controls, timestamps, adapter fields, and individual samples are retained in the linked JSON files.

## Results

| Scene | Samples | Mean interval (ms) | P95 (ms) | Max (ms) | Approx. FPS | Mean CPU submission (ms) | Submitted vertices |
|---|---:|---:|---:|---:|---:|---:|---:|
| transforms | 1801 | 16.667 | 17.700 | 17.800 | 60.00 | 0.649 | 114–114 |
| hierarchy | 1798 | 16.686 | 17.700 | 33.500 | 59.93 | 0.803 | 348–348 |
| camera | 1779 | 16.872 | 17.700 | 149.400 | 59.27 | 0.953 | 720–720 |
| curves | 1798 | 16.694 | 17.600 | 67.300 | 59.90 | 2.344 | 2169–2169 |

The two-view camera run submits both views plus the frustum. The curve run submits many line and marker vertices. Browser frame pacing remains close to the observed 60 Hz cadence; the raw maximum intervals show the occasional scheduling delays that a mean alone would hide. These results should not be interpreted as per-scene GPU execution costs.

## Raw data and reproduction

- [Transforms](measurements/transforms.json)
- [Hierarchy](measurements/hierarchy.json)
- [Camera](measurements/camera.json)
- [Curves](measurements/curves.json)

Build with `npm run build`, start `npm run preview`, select the scene and matching settings, and open **Performance measurement**. Click **Record 30 seconds**, keep the tab visible without changing the window or camera, then click **Save measurement JSON** after completion. Restore the same backing resolution before comparing another run.

## Screenshots

See the [screenshot index](screenshots/README.md) for seven unedited browser captures. Initial exploratory runs at 2200 × 960 were superseded by the four consistent-resolution runs above and are not included in this table.
