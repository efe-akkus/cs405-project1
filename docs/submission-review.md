# Submission review

Review date: 8 November 2026. Application baseline: `90f1731`. This records the pre-submission review; it does not mark the project as submitted.

## Verified

| Area | Evidence / check |
|---|---|
| Part A | Three objects, transformation controls and TRS/SRT matrix comparison are implemented and captured in the screenshot set. Numerical checks passed for rigid inverse and translation of homogeneous directions. |
| Part B | Scene traversal has nine nodes and four levels, eight rendered meshes, local axes and inherited animation. Checks passed for node counts, animation and reset. The draft includes a small-block world-matrix derivation; its translation agrees with the application to floating-point precision. |
| Part C | Numerical checks passed for eye-to-origin mapping, parallel-up fallback, rejection of coincident eye/target and perspective/orthographic near/far mapping to 0/1. The screenshot set includes both projections and the inspection frustum. |
| Part D | Numerical checks passed for cubic endpoints, Bernstein/de Casteljau agreement, C1 continuity after moving an anchor or handle, and Catmull-Rom interpolation endpoints. The JSON export agrees with the initial control points and declares three segments. |
| Part E | One application contains all views, reset and debug controls, frame intervals and vertex counts. The production build passes. |
| Evidence | Seven screenshots and four consistent-resolution recordings are saved under docs/. Earlier exploratory recordings are separate. |
| Draft report | project1-draft.pdf has five pages, the painting and artist, transformation explanation, a tree and verified leaf matrix, view derivation, depth convention, curve basis/endpoint proof/C1 condition, screenshots, measurements, debugging discussion and export/AI appendices. |

The numerical checks were executed directly against the existing modules without adding a permanent test suite. Browser captures and interactive validation come from the evidence session documented in docs/screenshots/README.md; this review did not repeat every mouse interaction. Only Chrome has been visually validated. Performance results are browser frame intervals and CPU submission measurements, not GPU execution times.

## Remaining before final delivery

1. Review the draft's text, mathematical notation and figure readability. Complete the student-maintained detailed AI-use record and reconcile the report appendix with it.
2. The historical AI-use wording in README.md and docs/PLAN.md reflects earlier instructions. It has intentionally not been rewritten, following the student's request to polish those files personally. Resolve that wording before final submission.
3. After approving the final report content, save the submission version as report.pdf. Keep project1-draft.pdf as a draft if desired. No final report copy has been created yet.
4. Commit and push the approved files using a student-approved commit message. No commit has been created during this review.
5. Create and push project1-final on the approved final commit. No tag or release has been created during this review.
6. Submit the repository link and final report separately on SUCourse. Local preparation and a GitHub push do not complete that submission.

Do not add a final tag until the final report and documentation review are complete. The report-draft commit and this review can be sent together when the student gives the instruction.

## Follow-up: 11 November 2026

The newly supplied Week 06/07 materials were compared with the project. The Catmull-Rom-to-Bezier conversion was adapted with attribution, and the earlier one-off numerical checks were supplemented by a reproducible Node test suite. All 13 tests and the production build pass. See [the course-material review](course-material-review.md). The original review above describes the state on 8 November; the PDF draft and benchmark recordings have not been regenerated in this follow-up. No commit or final tag has been created for these changes.
