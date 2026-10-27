# Stage B — Shared navigation and visual foundation

Implemented the approved dashboard shell across existing routes. BottomNavigation owns the five navigation positions and route-aware current-page state. Home covers scores and game previews; Favourites and More identify their routes. Cards and Feed remain explicitly unavailable. Search, native calendar and visible source disclosure remain functional.

Shared design-system.css supplies the approved black/turquoise palette, Inter family, caption/body/section type tokens, navigation dimensions, safe-area padding and reduced-motion hover behaviour. Existing page content and data contracts are preserved; game-centre and Favourites/More screen reconstruction remain later stages.

## Visual verification

- Actual Chromium captures at 390 × 744 for dashboard, favourites, preferences and game preview; preferences also captured at 1440 × 1000.
- Dashboard capture compared against Stage A deterministic demo using Pillow ImageChops: no changed pixels at 390 × 744.
- Mobile navigation bounds and one active route verified at 360px by browser test. Existing tests cover 360/390/768/1440 widths.
- Inspected dashboard, preferences phone/desktop and game phone screenshots. No horizontal overflow or browser page errors in capture run.
- Reference: docs/reference/approved-ten-screens.png. Shared bottom navigation uses the reference's five compact icon/label positions, with original routes and honest unavailable states.

## Validation

Production build, TypeScript, ESLint, 15 unit tests and all 11 Playwright browser flows passed. Browser tests include accessibility checks and an added shared-navigation route/width regression.

## Evidence

- docs/screenshots/stage-b-dashboard-390.png
- docs/screenshots/stage-b-game-390.png
- docs/screenshots/stage-b-favourites-390.png
- docs/screenshots/stage-b-preferences-390.png
- docs/screenshots/stage-b-preferences-1440.png
- docs/screenshots/stage-b-comparison.png (Stage A left, Stage B right)

Awaiting visual approval before Stage C game-centre reconstruction, per the requested staged workflow. No deployment performed.
