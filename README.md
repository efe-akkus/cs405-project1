# CS405 Project 1

Transformations, Projection and Curves from Paintings.

This repository will contain one interactive WebGPU application combining transformations, a scene graph, camera controls, and curves traced over a painting from the Sakıp Sabancı Museum collection.

## Current status

The directory structure and planning documents are in place. The application and Vite setup have not been implemented yet. This repository is not a copy of the instructor's project starter.

## Planned features

- A painting displayed on a textured plane, with at least three objects in front of it.
- Interactive transformations and a comparison of T·R·S and S·R·T, with both matrices displayed.
- A scene graph with at least five nodes, three hierarchy levels, animation, and local axes.
- Orbit controls, perspective and orthographic projections, and a frustum view from a second camera.
- Cubic Bézier curves, de Casteljau construction, at least three segments with C1 continuity, and a Catmull–Rom or B-spline curve.
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

The Vite configuration and application entry files have not been added yet. After setup is complete, the application will run with `npm install` followed by `npm run dev`.

## Deliverables

- The GitHub repository with the application and this README.
- A curve JSON export.
- A three-to-five-page `report.pdf` containing derivations, screenshots, debugging discussion, performance measurements, and an AI-use appendix.
- A `project1-final` tag or release created before the deadline.

The repository link and PDF must also be submitted to SUCourse. The deadline stated in the handout is 8 November 2026 at 23:59 Istanbul time.

## Sources and AI assistance

Any material adapted from course examples will be credited. AI assistance is used for explanations and debugging; the assessed mathematics, camera, scene-graph, and curve code must be written by the student. See [the AI-use record](docs/ai-use.md).

## Language

All project documentation, code comments, interface text, and commit messages are written in English.
