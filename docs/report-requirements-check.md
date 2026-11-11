# Report requirements check

Checked on 12 November 2026 for Efe Çağan Akkuş, student ID 32413.

## Source and scope

The reference document is the student's supplied report.pdf, preserved without edits. Assignment requirements were read from CS405_Project1_2026.docx; the ~$ owner file is not the handout. This check records where content occurs in the current report, not the former draft. It is not a grade guarantee or confirmation of submission.

| Requirement | Current report location | Result |
|---|---|---|
| Student name and ID | Page 1 | Efe Çağan Akkuş; 32413. No PDF metadata has been edited. |
| Three-to-five-page PDF | Whole file | Five pages. |
| Painting, artist and choice rationale | Page 1 | Kavunlu Natürmort, Şeker Ahmed Paşa; organic contour plus personal preference for melon with cheese in summer. |
| Transform orders, matrices and convention | Page 1 / Figure 1 | Both screenshots include matrix panels; numerical matrices, control values and column-vector/rightmost-first explanation are present. |
| Tree and leaf world matrix | Section starts page 1; tree/calculation on page 2 | Nine nodes, local/world chain, full leaf matrix, manual coordinate verification and separate mesh scaling. |
| View derivation | Pages 2-3 | Camera basis and matrix, including its final row continued on page 3; degeneracy handling is explained. |
| Two projections and frustum | Page 3 / Figure 3 | Same camera and frozen object pose; fixed inspection/frustum view. |
| Near/far and depth precision | Page 3 | Near 0.65, far 6.5; WebGPU endpoints 0 and 1 and precision explanation. |
| Bezier basis and endpoint proof | Page 3 | Bernstein weights, derivative and endpoint proof. |
| C1 joins, trace and second spline | Page 4 / Figure 4 | Three C1 segments, mirrored-handle condition, de Casteljau and Catmull-Rom; tangent animation and normalized export discussion. |
| Exported JSON | Page 5 / Appendix A | Compact JSON matches exports/curve.json. |
| Debugging | Page 5 | Preview/download problems, recorded-JSON viewer and consistent-resolution recording method. |
| Measured frame times and GPU | Page 4 | Apple M2 and five run aggregates matching current raw data. |
| AI-use appendix | Page 5 / Appendix B | Lists planning, debugging, tests, measurement tooling/evidence, report drafting and final language editing. This row describes the supplied statement; it does not assert that other assistance never occurred. |
| Course attribution | In-text references plus page 5 bibliography | Twelve numbered sources; detailed mapping in code-attribution.md. |

## Delivery state

The repository has the application, README, normalized curve export, seven screenshots, five raw measurements and the student's report.pdf. The old project1-draft.pdf has been removed locally by the student. A project1-final tag and confirmed SUCourse submission remain pending, as does an approved commit for the current changes.

This alignment changed no report bytes, wording, page layout, images, metadata or filename.
