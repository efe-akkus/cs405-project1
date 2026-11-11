# CS405 Project 1 completion plan

Updated on 12 November 2026 to match the student-provided report.pdf. This replaces the early proposal; it is a completion/status document, not a claim that submission has occurred.

## Report and implemented scope

Author: Efe Çağan Akkuş, student ID 32413. The report file is report.pdf and has five pages. Its contents and formatting are controlled by the student and have not been edited during this alignment.

The chosen painting is Kavunlu Natürmort by Şeker Ahmed Paşa. The report gives two reasons: a clear organic melon contour and a personal preference for melon, particularly with cheese in summer. The painting is a textured quad in a single WebGPU/WGSL application served with Vite.

| Part | Implemented work | Report location |
|---|---|---|
| A | Matrix helpers, three foreground objects, middle-object XYZ/Y-angle/scale controls, TRS/SRT and both numerical matrices | Page 1 |
| B | Nine nodes across four levels; table, four legs, turntable and two blocks; inherited animation and local axes | Pages 1-2 |
| C | lookAt with degenerate-up handling, mouse orbit, perspective/orthographic projections, fixed inspection camera and frustum | Pages 2-3 |
| D | Three-segment C1 Bezier contour, de Casteljau, Catmull-Rom, point placement/dragging, tangent arrow and normalized JSON export | Pages 3-4 |
| E | Shared view/reset/debug controls, frame interval and vertex counts, recorded JSON access | Pages 4-5 |
| Evidence | Seven screenshots and five measurements from 11 November; curve JSON appendix and twelve source references | Throughout the report |

The scene in the report is the implemented table/turntable/block hierarchy. The early arm/fruit-object proposal is not the current scene. Bonus features are not claimed.

## Verification and provenance

The existing suite contains thirteen passing checks for transforms, camera/frustum, curves/C1 editing, hierarchy/reset and export consistency. The production build passes. The recorded production bundle and application-source fingerprints match the current implementation; see measurements/build.json. Frame intervals and CPU submission time are not GPU execution time.

Course code/reference use is mapped in code-attribution.md. Appendix B of report.pdf supplies the current AI-use declaration; ai-use.md quotes it and retains the dated planning entry. This plan adds no authorship claim beyond those records.

## Remaining sequence

1. Student approval of the current report and aligned supporting documents.
2. Commit and push the approved files using a student-provided commit message. Include the student's replacement of project1-draft.pdf with report.pdf.
3. Create and push project1-final on the approved final commit.
4. Submit the repository link and report.pdf separately on SUCourse.

No commit, tag or submission is authorized by this plan alone. The handout states 8 November 2026 at 23:59 Istanbul time; any revised deadline must come from the instructor's current announcement.
