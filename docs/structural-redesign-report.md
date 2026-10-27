# PROJECT 01 — Structural redesign

## Diagnosis and changes

The previous admin-style sidebar, supporting rail, tiny uppercase labels and uniform two-column cards gave every element equal weight. The new composition removes both sidebars entirely. Desktop destinations now live in the top navigation, with the same destinations in the mobile bottom bar.

A single sports feed replaces the grid. One leading simulated in-progress fixture has opposing team identities and large scores; the remaining games use aligned divided rows, with state and favourite controls kept separate from fixture links. Plain date-led headings, larger names, tabular scores and quieter supporting text replace the dashboard labels. Date selection and underlined status filters are integrated into the feed.

Game previews are open scoreboard stages rather than bordered dashboard cards. Large scores precede team names, with atmospheric team-colour treatment and a separate quarter-scoring section. No unsupported tabs, player content or statistics were added.

The new palette uses #030607 canvas, #090F11 secondary, #10191C surfaces, #172326 raised, #213438 borders, #00E5D4 accent, #4CF5E9 hover, #F7FAFA text and #99ADB2 supporting text. System sans uses Segoe UI Variable/Segoe UI where available. Existing accent IDs and persistence remain compatible.

## Verification

Next.js project, routes, fixtures, domain/repository contracts, local preferences, search, favourites and sample update preserved. No packages or network integrations added.

Production build, explicit typecheck, lint, six unit tests and four original browser flows pass. Axe checks on scores, search dialog, preferences, favourites and game preview pass. Browser tests cover focus/Escape restoration, reduced motion, local storage recovery, separate follow clicks, sample update/reset, direct game routes, missing-quarter alignment, and responsive overflow at 360/390/768/1440.

## Actual visual iteration

First screenshots were captured and opened. The featured game was too tall on mobile and regular desktop rows had excessive distance between names and totals. The refinement moved featured badges beside names, shortened that presentation and narrowed the feed. Revised screenshots were captured and opened after the second production build. First-pass evidence is preserved in docs/screenshots/structural-pass-1.

Final screenshots are in docs/screenshots: redesign-dashboard-mobile.png (390x844), redesign-dashboard-desktop.png (1440x1000 viewport, full-page capture), redesign-game-mobile.png and redesign-game-desktop.png. Other responsive screenshots include all requested widths. See design-qa.md for comparison evidence.

## Limits

All data remains explicitly fictional. Apple Sports screenshot files were unavailable locally; the supplied REAL references were inspected. This is original composition, not pixel-for-pixel copying. No physical phone/Safari or screen-reader session and no measured FPS/field performance claim. Automated accessibility scans do not establish complete WCAG compliance.

## Run

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Open http://127.0.0.1:3000. This execution stops at the redesigned existing scope for visual review; it does not begin the next development phase.
