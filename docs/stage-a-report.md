# Stage A — approved screenshot dashboard reconstruction

Stage A only. Stopped for user visual approval before Stage B. No other reference screen was implemented or redesigned.

## Source and measurement

The attached 10-screen image was recovered losslessly from the image supplied in this conversation, saved to docs/reference/approved-ten-screens.png (1536x1024). The dashboard app content, excluding iPhone hardware, Dynamic Island and OS status bar, was cropped at (1258,50)-(1494,500): docs/reference/stage-a-dashboard-crop.png, 236x450 pixels. docs/reference/stage-a-dashboard-390.png normalizes this to 390x744 for comparison. Source resolution limits fine typography/asset judgments; no pixel-perfect claim.

Measured target: compact NBA header; four date tiles; All/Live/Upcoming/Completed chips; Games heading and view icons; two columns of roughly 178x140 fixture cards; small opposing logos/abbreviations; central scores or tip-off time; one status line; fixed bottom navigation around 66px high.

## Implemented

- Dashboard-only ScoresHeader and FixtureCard components in src/components/scores/dashboard.tsx.
- Scoped styles in src/app/scores-reconstruction.css. Existing shared/global design and other routes retain their previous presentation pending later stages.
- Minimal NBA header with working search and native calendar control, four-date strip, filled turquoise active filter, Games heading and functional grid/list view controls.
- Two compact columns at 360/390; three columns on tablet and four within a constrained desktop content width. No featured fixture, huge score or bright per-game border.
- Real ESPN logos/abbreviations/available scores/status remain normalized. Optional real overall team records added to the existing mapping/model; missing records omitted. No fabricated records or real-game results.
- Independent favourite controls overlay each logo area. Pointer hover/focus and followed state reveal a small star; keyboard focus is visible. Clicking a logo follow control does not open the fixture.
- Dashboard bottom navigation matches the five-item arrangement. Home, Favourites and More connect existing routes; Cards and Feed are explicitly disabled because those stages are not implemented. Standings opens an honest availability dialog, not fake standings.
- Demo and ESPN disclosure retained discreetly in the header. Receipt/stale detail and refresh are below the grid. No publishing or new backend features.

## Visual iteration

First capture: docs/screenshots/stage-a-first-pass.png. At 390px first card started at y=256, 14px above the normalized source. Longer real records were close to score text. Date/filter type was slightly underscaled.

Refinement: aligned first-card y=270; adjusted date/filter heights and text scale; corrected section spacing and bottom bar height; separated record text toward outer edges; kept tablet cards compact instead of stretching phone cards. Final screenshot recaptured and inspected alongside the crop, including focused controls/card comparison.

Combined evidence: docs/screenshots/stage-a-comparison.png and stage-a-detail.png. Final measurements saved in docs/stage-a-measurements.json:

| CSS width | Columns | First card | First card y | Navigation height |
|---|---|---|---|---|
| 360 | 2 | 165x137 | 270 | 66 |
| 390 | 2 | 178x140 | 270 | 66 |
| 768 | 3 | ~241x140 | 270 | 66 |
| 1440 | 4 | ~192x140 | 270 | 66 |

## Remaining visual differences

- Actual historical ESPN fixtures, dates, totals and records differ from the mockup's illustrative Lakers/Celtics slate. They were not falsified to match the image. Demo mode still uses the original fictional teams and scores.
- Required demo/unofficial-source disclosure adds one small header line absent from the mockup. Data freshness detail is below the grid to preserve the reference composition.
- Cards/Feed remain disabled; Standings shows an availability message. These are explicit Stage A limitations, not implemented community/cards/standings features.
- Existing Lucide icons are close equivalents; subtle icon shapes, image rasterization, a few pixel gutters and glyph rendering differ from the low-resolution reference.
- Favourite interaction targets are preserved over logo regions even though the reference does not show separate dashboard stars.
- Other routes intentionally keep their prior UI until approved for their stages. Native calendar styling depends on browser/OS.

## Verification

Production build, TypeScript typecheck, lint and 15 unit tests pass. Ten browser flows pass: all nine previous flows retained plus dashboard geometry/view-toggle/disabled-state/standings coverage. Existing broad search textbox selectors were narrowed to their accessible name after the calendar introduced a second textbox; no checks were removed or weakened.

Axe scans pass for original surfaces and ESPN preview. Search, favourite persistence/separate clicks, demo score update/reset, date/status filters, real-game reload, mode isolation, loading/error/retry, logo fallback, stale handling, malformed data and request races remain covered. Unmocked screenshots use real provider data and remote logos. No page errors or global horizontal overflow at the four requested widths.

No physical-device/Safari/screen-reader session or frame-rate claim. No deployment.

## Review and run

Open http://127.0.0.1:3000/?mode=espn&date=2026-04-05 for a populated real historical slate. Default fictional demo remains available.

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Please approve or request changes to Stage A before Stage B begins, as required by the supplied task.
