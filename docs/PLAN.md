# CS405 Project 1 file review and work plan

Review date: 5 November 2026. This document records the review and implementation plan; it is not the application deliverable.

## Review scope

The supplied path `/Users/efecagan/Desktop/26-27 Fall/CS 405.zip` did not exist at the time of review. The adjacent `CS 405` directory was inspected instead. Excluding `.DS_Store` files, 80 files were inventoried. Of these, 78 were identical by SHA-256 to materials previously reviewed for midterm preparation. That earlier comprehensive review was reused for identical content; slides and lab source code related to Project 1 were read again. The two additional files were the project handout and Project1.zip. The archive's HTML, JavaScript, and embedded image resource were also inspected. The inventory was saved as `review/inventory.json` in the separate review workspace.

## Findings

- Project1.zip contains Canvas 2D demonstrations of the required behavior. It is not a Vite/WebGPU application starter.
- Week02./Week02/lab1-starter and lab1-solution provide examples of WebGPU device setup, WGSL, uniforms, render pipelines, and render loops.
- Week04/lab3-starter contains actual WebGPU infrastructure, cube geometry, a depth buffer, resizing, a storage buffer, and instanced drawing. Quaternion and scene setup TODOs remain; it is not a finished project.
- Week04/lab3-starter/mat4.js provides complete matrix helpers for the lab. It should not directly replace the mathematics module students are required to write for Project 1.
- The Week 2 transformations lecture describes the Project 1 starter repository layout. It shows `git clone <your fork>` rather than an actual repository address. No GitHub URL was found in the inspected HTML, JavaScript, or README files.
- The materials do not contain a package.json, the project-specific src/painting.js or test/math.test.js, or the complete cs405-project1 repository.
- The Lab 2 instructions are present, but the referenced lab2-starter and lab2-solution directories are missing. The Lab 3 solution directory is also missing.
- The schedule mentions the curves lecture on 2 November and Lab 4 on 4 November, but their lecture and lab files are absent. Curve requirements are available in the handout and Project1 demonstration.
- Painting images are embedded in the course assets directories. Proposed choice: Şeker Ahmed Paşa, Kavunlu Natürmort. The student will make the final selection.
- Older HTML files under _superseded contain broken relative links caused by relocation. The scanned local href/src targets in current HTML files exist.

## Project objective

Place a painting from the SSM collection on a textured plane in a 3D scene; position objects in front of it, animate them through a hierarchy, control a camera, and trace a painted shape using interactive curves. All parts must be integrated into one WebGPU/WGSL application.

| Part | Points | Course connection | Completion criteria |
|---|---:|---|---|
| A Transformations | 20 | Weeks 2–3: homogeneous coordinates and matrix order | Student-written matrix module; at least three objects; UI controls; TRS/SRT switch; both matrices displayed |
| B Scene graph | 15 | Weeks 2–4: local and world transforms | At least five nodes and three levels; parent/children relationships; traversal; animation; local axes |
| C Camera | 20 | Week 4: viewing and projection | lookAt with parallel-up handling; WebGPU perspective and orthographic projection; mouse orbit; camera parameters; frustum seen from a fixed second camera |
| D Curves | 25 | Scheduled curves lecture and Project1 demonstration | Cubic Bézier; de Casteljau; at least three segments with C1 continuity; Catmull–Rom or B-spline; control point placement and dragging; tangent-oriented animation; normalized JSON export |
| E Integration | 10 | Rendering pipeline and modular application structure | One application; reset, debug, and view controls; frame-time and submitted vertex count; README |
| Report | 10 | Derivations, manual verification, and measurement | Three to five PDF pages; painting details; derivations; screenshots; debugging discussion; GPU and measurements; AI-use appendix |

Week 1 color material supports correct sRGB texture handling. Week 5 rasterization material supports depth testing and understanding the rendering pipeline. Writing a CPU DDA/Bresenham implementation or a custom triangle rasterizer is not a project requirement. A quaternion camera is a bonus and will not be added before the core requirements are complete. IK is not required.

## Proposed scene

Kavunlu Natürmort hangs on a plane at the back. A table, fruit objects, and an animated arm made from simple geometry stand in front. A root → table → arm base → arm → end object chain demonstrates the hierarchy. At least three Bézier segments trace the melon contour in the painting. An object moving along the curve follows its tangent. This is a design proposal and has not been implemented.

## Implementation sequence

1. Open a separate copy of Lab 3 and verify device setup and rendering. No browser execution was performed during this review.
2. If the project-specific starter repository cannot be obtained, prepare Vite infrastructure and record which resources come from course examples. The availability of lab code does not automatically establish permission to reuse every part or satisfy all project requirements.
3. The student writes vec3 and mat4 functions and checks them against manually computed examples. Make the TRS/SRT comparison visible.
4. Display the painting texture and three objects. Add the scene graph, animation, and axes.
5. The student writes camera and projection functions. Complete orbit controls, both projections, and the frustum view from a second camera.
6. Learn curves through numerical examples, then have the student implement Bézier, de Casteljau, C1 continuity, and Catmull–Rom. Add interaction in the painting plane, animation, and JSON export.
7. Check each requirement, measure performance on the actual machine, capture evidence screenshots, and complete the report and README.
8. Submit the GitHub repository, JSON, and report.pdf. Create the project1-final tag or release before the deadline. SUCourse submission is also required.

The handout deadline is Sunday, 8 November 2026, at 23:59 Istanbul time. Proposed targets: infrastructure and Part A on 5 November; Parts B/C on 6 November; Part D on 7 November; integration, verification, and the report on 8 November. This is a tight schedule; implementation speed has not yet been measured. Bonus features are outside the initial scope.

## Assistance approach

The handout permits AI explanations and debugging but prohibits AI generation of matrix, camera, and curve code. The Week 2 project clinic slide explicitly includes scene-graph code in this restriction. The student writes these parts; the assistant explains concepts, reviews attempts, and diagnoses errors. AI assistance is recorded in the appendix with the tool, request, and retained content. These restrictions are course conditions stated in the source materials; no additional user approval is being requested.

## Items not yet verified

- The location and accessibility of the actual Project 1 starter repository.
- WebGPU application execution and measured performance on the machine.
- The student's final painting and scene selection.
- Whether the missing curves lecture and lab files exist elsewhere.
