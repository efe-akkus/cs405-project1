# Report screenshots

Captured from the production build in Chrome on 8 November 2026, with a 2200 × 1145 canvas backing resolution. Full-page browser captures include the controls and available explanatory panels. Performance readouts in the images are instantaneous rolling readouts; use [the measurement record](../measurements.md) for the retained 30-second results.

| File | Evidence |
|---|---|
| [Part A: TRS](part-a-trs.jpg) | Three objects, default controls, and both model matrices |
| [Part A: SRT](part-a-srt.jpg) | Same controls with the transformation order changed |
| [Part B: hierarchy](part-b-hierarchy.jpg) | Scene tree and local axes; turntable paused for capture |
| [Part C: perspective](part-c-perspective.jpg) | Orbit camera and inspection view with perspective frustum |
| [Part C: orthographic](part-c-orthographic.jpg) | Same camera position with orthographic projection |
| [Part D: Bézier](part-d-bezier.jpg) | Three-segment C1 trace, control handles, de Casteljau and tangent arrow at t = 0.300 |
| [Part D: Catmull–Rom](part-d-catmull-rom.jpg) | Spline through the trace anchors at t = 0.300 |

The camera screenshots use the same eye/target and FOV control value. The turntable continues animating between these two captures, so the blocks have different orientations. Curve animation is paused in the screenshots to make the constructions readable; it is enabled for the performance run.
