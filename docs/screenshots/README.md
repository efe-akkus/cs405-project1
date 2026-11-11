# Report screenshots

All seven images were refreshed on **11 November 2026**, using the same current production build as the five performance recordings. Capture viewport: 1280 × 900 CSS pixels, DPR 1; canvas backing resolution: 980 × 558. Full-page captures may be taller than the viewport to retain the controls and supporting panels. See [measurements](../measurements.md) and [build provenance](../measurements/build.json).

| File | Evidence |
|---|---|
| [A TRS](part-a-trs.jpg) | Three objects, default controls and both numerical matrices |
| [A SRT](part-a-srt.jpg) | Identical controls with the composition order switched |
| [B hierarchy](part-b-hierarchy.jpg) | Paused turntable, local axes and complete scene tree |
| [C perspective](part-c-perspective.jpg) | Default orbit camera and fixed inspection/frustum view |
| [C orthographic](part-c-orthographic.jpg) | Same camera pose and frozen object pose as the perspective capture |
| [D Bezier](part-d-bezier.jpg) | C1 trace, control handles, de Casteljau and tangent arrow at global t = 0.300 |
| [D Catmull-Rom](part-d-catmull-rom.jpg) | Spline through the anchors at global t = 0.300 |

Turntable animation was paused across both camera captures, making the projection comparison consistent. Curve animation was paused for the two curve images; it was enabled for their performance recordings. Screenshot readouts are live rolling values, not run aggregates. The PDF clips canvas/contour details for legibility and reproduces the A matrices as text; the full-page files here preserve the UI context. Old images have been replaced.
