# Week 06 and Week 07 review

Reviewed on 11 November 2026 against the files newly supplied by the student. The review began at application baseline `d46b624`; the code adaptation and tests were subsequently committed as `e0677d5`. The report revision described below is a later documentation update.

## Materials and relevance

| Supplied material | Topics relevant to this project | Decision |
|---|---|---|
| Week06/L1-Mon-Nov02-Curves.html; Monday talking notes; demos/w6a.js | Bernstein basis, recursive de Casteljau, derivatives, parameter speed versus arc-length speed, C0/G1/C1/C2, Catmull-Rom, B-splines, tracing and export | Use the worked examples as numerical checks. Adapt C6.crBez for the Catmull-Rom implementation. |
| Week06/L3-Thu-Nov05-Surfaces-Meshes-Lighting.html; Thursday talking notes; demos/w6b.js | Revolution surfaces, patches, mesh representation, normals, Lambert/Phong/Blinn-Phong and yaw/pitch vector rotation | Check the existing matrix rotations against the independent V3.rot formula. Mesh/lighting additions are not needed for the required A-E deliverables. |
| Week07/L1-Mon-Nov09-Texturing.html; demos/w7a.js and w7lib.js | UVs, perspective-correct sampling, wrap/filter modes, sRGB, minification, mipmaps, anisotropy | Check the painting's UV convention, sRGB texture and sampler against the lecture. Keep the current required renderer. |
| Week07/L3-Thu-Nov12-Maps-Multipass-NPR.html; demos/w7b.js and w7lib.js | Material/normal maps, displacement, multipass targets, blur, bloom, G-buffer and NPR | These are later topics and are not added to Project 1. They may be useful for subsequent coursework. |
| Both weeks' index/common files and assets | Deck controls, live-code helpers, painting/photo data and teapot patches | Supporting teaching resources, not a Vite/WebGPU project starter. No replacement assets are needed for the chosen Kavunlu painting. |

The demonstrations are predominantly Canvas 2D or software rasterization, even where they illustrate GPU concepts. Their rasterizers and deck UI are not imported into the WebGPU application. The new files do not supply a replacement 4x4 affine matrix library; their curve basis matrices and vector rotations have different roles from model/view/projection matrices.

## Code adapted with attribution

`src/math/curves.js` now converts a uniform Catmull-Rom segment to cubic Bezier controls, following `C6.crBez` in `Week06/demos/w6a.js`:

- B0 = P1
- B1 = P1 + (P2 - P0) / 6
- B2 = P2 - (P3 - P1) / 6
- B3 = P2

The existing cubic evaluator and derivative then evaluate the segment and its tangent. This replaces the duplicated expanded Catmull-Rom position/derivative polynomials. It retains the same uniform spline, endpoint repetition, coordinate convention and public function signatures. No lecture demo, UI or painting trace is copied wholesale. The adaptation is credited next to the helper.

The rotation oracle in `test/matrices-camera.test.js` is adapted from `V3.rot` in `Week06/demos/w6b.js`. It is used only to check matrix composition against the course's vector formula.

## Reproducible checks

Run `npm test` (Node's built-in test runner; no new package dependencies). Thirteen tests passed:

- Lecture slide 9: all de Casteljau midpoint levels for (0,0), (2,4), (6,4), (8,0), giving (4,3) and tangent (9,0).
- Cubic endpoint interpolation, agreement with recursive interpolation and affine invariance.
- Lecture slide 20: Catmull-Rom midpoint (3,1) for (0,0), (2,2), (4,0), (6,2), with endpoint tangents (2,0).
- Bezier conversion against an independent expanded Catmull-Rom polynomial at 51 parameters, plus finite-difference tangent checks.
- Both C1 joins after moving either adjacent handle or the shared anchor.
- Rejection of a handle move whose mirrored partner would leave the normalized painting.
- Piecewise endpoints/joins and the saved normalized export.
- Manually computed TRS/SRT origins and homogeneous direction handling.
- Matrix rotation against the course yaw-then-pitch formula.
- Rigid inverse in both multiplication orders and double transpose.
- Camera eye/target mapping, parallel-up fallback and coincident-eye rejection.
- Perspective/orthographic near/far mapping and all reconstructed frustum corners.
- Scene counts, leaf origin, inherited animation and reset.

`npm run build` and `git diff --check` also passed. These checks cover mathematics and build output; they do not replace browser interaction tests or a fresh GPU benchmark.

## Week 07 texture comparison

The painting quad has UV (0,0) at the image's top-left; the normalized curve export deliberately uses a bottom-left origin. `src/render/painting.js` creates an `rgba8unorm-srgb` color texture with linear min/mag filters and clamp-to-edge addressing. The fragment shader uses `textureSample`; the renderer writes through an sRGB attachment. These match the lecture's color-texture workflow and leave filtering to WebGPU rather than reproducing its CPU texture sampler.

The application currently has only the base texture level. It does not claim trilinear mipmapping or anisotropic filtering. The lecture explains that linear minification filtering alone does not remove all aliasing; adding a mip chain is a possible later improvement, not an implemented feature. Normal maps would use a linear data format, but this project does not use them.

## Current report and measurement status

The five-page draft now cites the Week 06 adaptation and tests and explains the Week 07 texture setup. All seven screenshots and five recordings were refreshed on 11 November from the current production build, including separate Bezier and Catmull-Rom runs. The source/bundle fingerprints are saved in docs/measurements/build.json. Old measurement sets and exploratory files were removed at the student's request; the report uses only the new set.

The measurement panel now shows the completed raw JSON in a collapsible section, allowing direct verification without relying on browser downloads. This changes result access, not the measurement method. The student-maintained AI-use record is unchanged. Final student review, commit approval, tagging and SUCourse delivery remain separate steps.
