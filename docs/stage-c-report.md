# Stage C — Play-by-play and statistics

Implemented in the existing game routes, with no new API integration or deployment.

## Changes

- Extracted GameCentre from the shared application component. Compact back/matchup/search toolbar replaces the oversized game hero, with shared section tabs and visible data disclosure.
- Overview retains quarter totals, missing-quarter placeholders, venue/tip-off information and persistent team favourites.
- Play-by-play has quarter filtering, compact chronological rows (newest first), team marks, timestamps and available demo score context.
- Stats has two-team selection and aligned Starters/Bench tables with MIN, PTS, REB, AST and FG columns.
- Lineups remains disabled because it is unsupported.
- One existing fictional fixture, game-1-0, has explicitly illustrative fictional players and events in a separate domain fixture. These are never supplied to ESPN games. The existing sample update adds its matching new play.
- ESPN's current normalized contract only exposes basic game information and periods. Its Stats and Play-by-play views show clear unavailable messages. Cached-data warnings remain visible.

## Reference comparison

Source crops exclude hardware and operating-system chrome:
- docs/reference/stage-c-play-by-play.png
- docs/reference/stage-c-stats.png

Actual screenshots and side-by-side comparisons:
- docs/screenshots/stage-c-play-by-play-390.png
- docs/screenshots/stage-c-stats-390.png
- docs/screenshots/stage-c-play-by-play-comparison.png
- docs/screenshots/stage-c-stats-comparison.png

The first visual pass exposed inherited uppercase table headings and tinted final columns. These were corrected in a second pass. The compact score header, tab underline, team-selector proportions, separators and aligned columns follow the source. Remaining differences: the required source/demo labels add vertical space; fictional identities and monogram fallbacks replace real players and unsupported photography; the existing shared bottom navigation remains available. This is not a pixel-perfect claim.

## Verification

- Production build, typecheck and lint passed.
- All 15 unit tests passed.
- All 13 browser flows passed, including added game-centre filtering/team switching, sample-event consistency, keyboard search focus, axe accessibility and ESPN/demo separation checks.
- Captured Overview, Play-by-play and Stats at 360, 390, 768 and 1440px. Inspected final phone/desktop renderings; no horizontal overflow or capture-run page errors.
- Existing scores, favourites, search, preferences and provider tests remain passing.

Run locally:
`powershell -ExecutionPolicy Bypass -File .\run.ps1 dev`

Open `/games/game-1-0`, then select Play-by-play or Stats to review the illustrative views. Stage D favourites/settings reconstruction awaits approval.
