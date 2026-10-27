# Phase 2.2.1 — Pregame polish and historical comparison

20 October 2026. Small refinements to the approved pregame experience. The matchup header, fixture strip, game tabs, NBA home, profiles, tracker, favourites, Feed, live statistics and play-by-play were preserved. Phase 2.3 was not started.

## Confirmed issues versus screenshot artefacts

**Mobile navigation:** browser testing at 390 × 844 confirmed that the bottom bar stays at viewport y=778–844 while the document scrolls. Expanded history and final content remain reachable. In the final production review, the footer ends at y=743.94, above the bar. The apparent bar halfway through an earlier full-page image is a fixed-element capture artefact. Navigation appearance, positioning and interaction code were not changed.

The existing bottom inset styling remains. A regression test simulates an additional 34px inset by increasing bar padding and verifies that final text remains reachable above it. This is browser simulation, not a physical iPhone test; Chromium's native safe-area emulation command was unavailable.

**Desktop modal:** the old fixed inset/automatic height combination stretched the modal to its maximum even when content was short. It now uses content-aware height, a 90dvh maximum and internal vertical scrolling when constrained. It remains centred with the existing backdrop. At 1440 × 1000, the actual current-season view measures approximately 737px high and the populated historical view 704px, rather than the old 900px stretch. The short Advanced state is smaller again. A 500px-high viewport test confirms internal scrolling.

Mobile remains a full-height sheet. Top and bottom sheet padding now include supported safe-area insets. The existing native dialog, focus trap, focus restoration, Escape handling, background scroll lock and reduced-motion system remain.

## Historical comparison

The current **2026–27 Regular Season** remains the default. An explicit Statistics season selector offers **2025–26 Regular Season (previous)** only when a meaningful equivalent metric is verified for both teams.

Season selection is shared between the overview comparison and Full Comparison. Category selection survives season changes; switching seasons does not refetch data or close the modal. A contextual note and the modal title identify previous-season data.

Only the comparison averages change. Current matchup records, conference context, recent form and home/away records stay current-season. No historical record is substituted into current context. The historical option is limited to regular-season fixtures and the immediately preceding regular season. A mismatched season, competition or team identity fails model validation.

Sources reuse the existing ESPN season/team statistics and standings endpoints, with explicit requested-season and competition checks. Historical resources and the assembled historical dataset cache for one hour; missing historical availability caches for five minutes. The existing bounded client cache retains the complete payload across tab/modal interactions. No scraper, additional upstream provider or dependency was introduced.

**Actual statistics load:** Boston and Detroit each return 13 supported historical metrics, including all ten requested core statistics. The historical data audit records the complete values and sources. Examples: Boston 114.9 PPG versus Detroit 117.8 PPG; FG% 46.7 versus 48.5. Opponent PPG uses explicitly supplied historical standings averages. Shooting and other averages use validated team statistics. Assist/turnover ratio and offensive/defensive rebound averages remain available in their existing categories.

Advanced metrics remain unavailable. No efficiency, pace or rating estimates were invented. Where no meaningful historical comparison exists, no empty historical option is offered.

## Celtics–Pistons history audit

All four schedule results were checked independently against their individual game-summary responses. Dates, stable IDs, home/away mapping and totals agree. The regression fixture preserves the original provider results:

| Game ID | UTC start | Away | Home | Winner |
|---|---|---|---|---|
| 401809250 | 20 Jan 2026, 01:00 | BOS 103 | DET 104 | Detroit |
| 401836803 | 16 Dec 2025, 00:00 | DET 112 | BOS 105 | Detroit |
| 401809802 | 26 Nov 2025, 22:00 | DET 114 | BOS 117 | Boston |
| 401809961 | 26 Oct 2025, 19:30 | BOS 113 | DET 119 | Detroit |

All are **2025–26 regular-season** games. Display dates use the browser's local timezone, so another timezone may legitimately show the preceding calendar day. The actual browser audit also clicked the first meeting: `/games/espn-401809250` loaded the correct away 103 / home 104 header. Unexpected results were not “corrected.”

[Source and summary cross-check audit](pregame-phase221-historical-audit.json) · [Production browser audit](pregame-phase221-browser-audit.json).

## Files

- New `src/data/espn/historical-comparison.ts`: equivalent previous-season statistics, provenance, cache and availability checks.
- `src/domain/team-comparison.ts`: optional validated historical dataset and shared result-winner helper.
- `src/data/espn/pregame-server.ts`: attaches the optional regular-season historical dataset; versions the assembled cache key.
- `src/components/game/pregame-overview.tsx`: shared season selection, explicit historical labels, comparison-only projection and preserved category state.
- `src/app/pregame.css`: content-aware desktop dialog, mobile safe-area padding and compact selector styling.
- New focused tests: `tests/pregame-polish.test.ts`, `tests/e2e/pregame-polish.spec.ts`.
- Recorded provider fixtures: `tests/fixtures/pregame-celtics-pistons-schedule.json`, `pregame-detroit-statistics.json`. Existing Boston statistics fixture is reused.

UI/UX Pro Max guidance was used for fixed-navigation clearance and accessible controls. Existing tokens, typography, columns, Motion and native dialog systems remain.

## Verification and screenshots

Typecheck, ESLint, production build and **46 unit tests pass**. Four new browser flows cover season separation/category retention, missing historical data, navigation clearance and modal sizing/scrolling across 390, 768, 1024, 1440 and 1920px. **All 59 production browser tests pass** (2.3 minutes), including the existing keyboard, focus, reduced-motion, live/final and unrelated-feature regressions.

Actual-provider historical modal views pass axe at all five widths. No browser page errors or horizontal overflow were observed in the page or modal. Existing keyboard/reduced-motion and live/final regression flows remain in the suite.

All images below show the actual production app with real provider responses; none use intercepted statistics:

- [Mobile overview, current season](screenshots/pregame-phase221-overview-390.png)
- [Desktop overview, current season](screenshots/pregame-phase221-overview-1440.png)
- [Desktop historical comparison with real data](screenshots/pregame-phase221-historical-overview-1440.png)
- [Resized desktop modal, current season](screenshots/pregame-phase221-full-current-1440.png)
- [Desktop historical Full Comparison](screenshots/pregame-phase221-full-historical-1440.png)
- [Mobile historical Full Comparison](screenshots/pregame-phase221-full-historical-390.png)
- [Mobile bottom clearance at end of page](screenshots/pregame-phase221-mobile-bottom-clearance.png)

Additional historical modal captures: [768px](screenshots/pregame-phase221-full-historical-768.png), [1024px](screenshots/pregame-phase221-full-historical-1024.png), [1920px](screenshots/pregame-phase221-full-historical-1920.png).

## Remaining limits and run

ESPN remains an unofficial development preview subject to existing licensing restrictions, delays and outages. Current-season averages may remain unavailable. Historical data is not a reconstruction of the exact pre-tip-off snapshot for a past game. Advanced metrics, split scoring averages and regional broadcast rights remain unverified. No physical-device or non-Chromium verification is claimed.

Preview: http://127.0.0.1:3200/games/espn-401909088

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```
