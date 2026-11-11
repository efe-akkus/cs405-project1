# CS405 Project 1

Transformations, Projection and Curves from Paintings.

This repository contains one interactive WebGPU application combining transformations, a scene graph, camera controls, and curves traced over a painting from the Sakıp Sabancı Museum collection.

## Current status

Parts A–D are implemented in one application, with view switching, scene reset, debug controls, browser frame timing, and submitted vertex counts. Seven report screenshots and four 30-second performance recordings are available in `docs/`. The final report and submission tag are pending.

## Features

- A painting displayed on a textured plane, with at least three objects in front of it.
- Interactive transformations and a comparison of T·R·S and S·R·T, with both matrices displayed.
- A scene graph with at least five nodes, three hierarchy levels, animation, and local axes.
- Orbit controls, perspective and orthographic projections, and a frustum view from a second camera.
- Cubic Bézier curves, de Casteljau construction, at least three segments with C1 continuity, and a Catmull–Rom spline.
- Control point placement and dragging, tangent-oriented animation, and normalized JSON export.
- Frame-time and submitted vertex-count readouts, view controls, debug toggles, and scene reset.

## Directory structure

- `public/assets/`: painting image and other static assets.
- `src/math/`: student-written vector, matrix, camera, and curve calculations.
- `src/scene/`: scene nodes, scene setup, and animation.
- `src/render/`: WebGPU infrastructure, geometry, textures, and debug drawing.
- `src/interaction/`: camera controls and curve editing.
- `src/ui/`: controls and readouts.
- `src/shaders/`: WGSL shaders.
- `test/`: verification tests.
- `exports/`: curve JSON export with normalized control point coordinates.
- `docs/`: work plan, screenshots, measurements, and AI-use record.

## Running the application

Use Node.js 20.19+ or 22.12+ and a browser with WebGPU support.

From the repository root, run the following commands.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally http://127.0.0.1:5173/. Keep that terminal running while using the application. WebGPU requires localhost or HTTPS.

To build and preview the production bundle, run the following commands.

```sh
npm run build
npm run preview
```

## Verification

```sh
npm test
npm run build
```

The Node.js tests check course curve examples, C1 editing constraints, matrix composition, camera depth/frustum calculations, hierarchy/reset behavior and export consistency. They run without browser or additional test dependencies. See [the Week 06/07 review](docs/course-material-review.md) for source attribution, scope and limitations.

## Controls

| View or control | Behavior |
|---|---|
| View | Switch between Parts A, B, C, and D in the same application |
| Part A | Adjust the middle object's XYZ translation, Y rotation, and uniform scale. Switch between TRS and SRT. Both model matrices appear below the canvas |
| Part B | Toggle turntable animation. The two blocks inherit its rotation. The scene tree appears below the canvas |
| Part C | Drag within the left viewport to orbit. Switch between perspective and orthographic projection. Change the perspective FOV. The fixed right camera shows the main camera's frustum |
| Reset camera | Restore the initial orbit position, perspective projection, and FOV |
| Part D | Switch between cubic Bézier and uniform Catmull–Rom. Drag control points, or select a point and use Place selected point before clicking the painting |
| Path parameter t | Scrub through the three segments. Moving this slider pauses curve animation |
| Animate along curve | Move the red arrow along the curve with its orientation following the tangent |
| Show de Casteljau | Show intermediate interpolation levels for the active Bézier segment when debug drawings are enabled |
| Reset trace | Restore the initial contour and parameter, and pause curve animation |
| Export JSON | Download the current curve as curve.json, with coordinates normalized to the painting and an origin at the bottom-left |
| Show debug drawings | Toggle local axes in Parts B/C and the control polygon and de Casteljau construction in Part D. Editing points remain available |
| Reset scene | Restore transforms, turntable angle, camera settings, and the original Bézier trace. Restore the default animation and debug settings while keeping the current view |
| Restart renderer | Reconnect to WebGPU while preserving scene controls |

Bézier anchors are blue, handles are white, and the selected point is orange. Handles mirror at interior joins to enforce C1 continuity. A move that would place a point or its mirrored handle outside the painting is rejected.

The default contour follows the melon slice's lower edge. The initial export is included in exports/curve.json. Replace it with a new export if the final trace is edited.

## Performance readouts

Frame interval is the mean browser animation-frame interval over approximately half a second. Gaps of 250 ms or longer, such as background-tab pauses, are excluded. This metric is not a GPU execution-time measurement.

Vertices counts all vertices submitted for the painting, objects, axes, frustum, and curve geometry. Both camera views are counted in Part C.

The production build has been checked in Chrome. See [performance measurements](docs/measurements.md) for the Apple M2 environment, four retained 30-second runs, and raw JSON samples. See [report screenshots](docs/screenshots/README.md) for the seven browser captures.

Open Performance measurement to record a 3-second warm-up followed by 30 seconds of foreground frame intervals. Save measurement JSON downloads the complete sample set. Unlike the rolling readout, this recorder retains long foreground intervals and cancels when the tab becomes hidden or the canvas resolution changes.

## Deliverables

- The GitHub repository with the application and this README.
- A curve JSON export.
- A three-to-five-page `report.pdf` containing derivations, screenshots, debugging discussion, performance measurements, and an AI-use appendix.
- A `project1-final` tag or release created before the deadline.

The repository link and PDF must also be submitted to SUCourse. The deadline stated in the handout is 8 November 2026 at 23:59 Istanbul time.

## Sources and AI assistance

The uniform Catmull-Rom-to-Bezier conversion in `src/math/curves.js` is adapted from `C6.crBez` in the supplied `Week06/demos/w6a.js`. A rotation check in the test suite is adapted from `V3.rot` in `Week06/demos/w6b.js`. Lecture examples and the Week 07 texture comparison are documented in [the course-material review](docs/course-material-review.md). AI assistance is used for explanations and debugging; the assessed mathematics, camera, scene-graph, and curve code must be written by the student. See [the AI-use record](docs/ai-use.md).

## Language

All project documentation, code comments, interface text, and commit messages are written in English.
