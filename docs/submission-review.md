# Submission review

Updated: **11 November 2026**. The current production build is based on e0677d5 with a recorded-JSON viewer added to the measurement panel. Exact source/bundle fingerprints are in [build provenance](measurements/build.json). This is a preparation record, not confirmation of submission.

## Verified

| Area | Current evidence |
|---|---|
| A | Three objects, UI transforms, TRS/SRT switch and both matrices; new screenshots. |
| B | Nine nodes across four levels, local axes and inherited animation; leaf-origin derivation and reset tests. |
| C | View derivation, degeneracy handling, WebGPU 0/1 depth endpoints and frustum corner tests; new perspective/orthographic captures with the same frozen scene pose. |
| D | Bezier/de Casteljau, edited C1 joins, course-adapted Catmull-Rom, tangent evaluation and normalized export checks; new screenshots and separate measurements for both curve modes. |
| E | Integrated view/reset/debug controls, timing/vertices and raw recorded-JSON access. Production build passes; all 13 tests pass. |
| Evidence | Seven fresh screenshots and five fresh 30-second recordings, all at 980 × 558 backing resolution. Old measurement sets are removed. |
| Report | project1-draft.pdf is revised for this current evidence set, with mathematical derivations, readable figure details, updated measurements and course-source attribution. |

The math tests do not replace full browser input testing. This evidence session verified view/projection/curve switching, animation toggles, reset controls and measurement completion; captured warning/error logs were empty. Measurements are browser frame intervals/CPU submission times, not GPU execution times.

## Remaining

1. Student review of the revised draft and completion of the student-maintained detailed AI-use record.
2. Reconcile historical AI-use wording in README.md and docs/PLAN.md during the student's final polish, as previously requested.
3. After final approval, save report.pdf for submission.
4. Commit/push only with a student-approved message, then create/push project1-final on the approved final commit.
5. Submit the repository link and report.pdf separately on SUCourse.

No final report copy, commit, tag or SUCourse submission has been created during this update.
