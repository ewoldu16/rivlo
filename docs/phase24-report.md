# Rivlo Phase 2.4 ? in-game player and play detail overlays

Implemented 21 October 2026. No standalone play-detail route was created.

## What changed

Player names and portraits in the live feed, player names/portraits/rows in the Stats tab, and player names in the contextual recent-scoring card open the corresponding **player** overlay. The rest of a feed event opens a separate **play** overlay. Independent sibling buttons prevent player actions from opening the event overlay. Full profiles remain an explicit secondary link.

Both overlays remain within the current game route. A stacked native dialog supports play ? player, player ? recent play, Back, Escape, close and backdrop dismissal. Returning restores the previous overlay, its scroll offset and the initiating control's focus. Closing the root restores game focus and scroll; missing/removed triggers safely fall back to the game panel. Native modality makes the background inert, focus wraps, and background body scrolling is locked with scrollbar compensation. Opening and closing animate subtly and respect reduced-motion settings. Mobile uses a near-full-height, independently scrolling sheet with sticky controls.

The existing black/charcoal/gold design, match header, navigation, comparison, favourites, roster portrait viewer, tracker persistence and live polling are preserved. The game page remains visible behind a dimmed backdrop.

## Player details

- Large ID-matched ESPN portrait (existing safe mapping and silhouette fallback), full name, actual game-time team, position and jersey.
- Shared live Summary box score: PTS, REB, AST, STL, BLK, turnovers, FG, 3PT and FT. DNP and absent values stay unavailable rather than becoming zero.
- Verified game-season/competition averages calculated with the existing game-log mapper and average calculations. They are loaded only when a player is opened, coalesced/cached per game/player for five minutes, and labelled with season, competition, published-log count and cached state.
- Recorded quarter scoring and FG/3PT/FT splits calculated only from source shooter roles, shooting flags and shot values. Missing periods/records show dashes. This is explicitly labelled **recorded plays**, not official quarter box-score totals.
- Six most recent published plays involving that player, each opening its event overlay.
- Existing active My Tracker targets for this exact game/player, read through the existing repository. The overlay does not create duplicate records. Target creation links into the existing prefilled tracker workflow.
- Full player profile and existing portrait enlargement remain available.

## Play details

- Provider title/description, relevant participant portrait, game-clock/period/team context and the recorded score at that event.
- Participant roles with independent player-overlay actions.
- Provider-reported scoring outcome, score value and attempted shot value where supplied.
- Verified shot-coordinate plot when numeric coordinates are in the observed supported range. Sentinel, invalid, out-of-range and non-shooting coordinates are excluded.
- Shooting splits and consecutive recorded field-goal makes/misses through this event, derived only from that player's published shooter sequence. No historical/career streaks or rankings are fabricated.
- Chronological previous/next navigation by stable event ID. Corrected event bodies update in place. Removed selected events show a deliberate no-longer-available state.

## Data architecture and request behavior

The existing `/api/nba?game=...` polling response now carries normalized box-score rows and optional event metadata already present in its cached ESPN Summary/Core responses. There are **no additional Summary/Core requests caused by opening a play**, and no separate live polling subscription for overlays. The Stats tab and player overlay consume the same received rows and update while open.

`/api/game-player?game=espn-ID&player=ID` is a read-only, identity-validated season-average endpoint. It derives season/competition from the verified game and checks the player is in that game's Summary box score. It reuses `getSummary()`, the existing shared five-minute ESPN game-log cache, strict log-season/competition mapping and `rosterAverages()`. No biographies or current-team association are guessed from unrelated games. An older snapshot lacking shared box rows can use one coalesced existing `/api/explore?kind=box` request; normal new live snapshots need none. Retry is explicit for season failures.

The common player schema moved to `src/domain/player.ts` to avoid a circular dependency; its previous ecosystem export remains compatible. Existing provider URLs, live cache TTLs, polling cadence, failure recovery and score update logic did not change.

## Source verification and limitations

Actual provider responses were captured for live Philadelphia 76ers at New York Knicks (**401909089**) and the completed Boston Celtics at Detroit Pistons (**401909088**).

- Summary supplies box-score identities, team assignments, jerseys, positions, portraits and statistic strings. Core supplies shooter/assister/rebounder roles, scoring/shooting flags, shot values and coordinates; missing optional fields are preserved as unavailable.
- The tested Core player-statistics `?period=1` probe still returned `All Splits / Total`, not a verified quarter breakdown. The UI therefore uses clearly labelled recorded shooting/scoring by quarter; it does not present those values as an official complete quarter box score.
- Numeric coordinates were present (for example a supplied X 11, Y 25 on Tyrese Maxey's three-pointer). Court orientation and units could not be verified. The shot panel therefore uses labelled provider-coordinate axes, with an explicit orientation/units note; it does not invent court geometry or rotate guessed locations onto a basketball floor.
- The current 2026?27 player game-log response contained no published games for the captured player. Season averages correctly display dashes and a zero published-log count. No prior-season values are substituted.
- Quarter shooting totals, shooting runs and splits may be incomplete or lag the box score if source plays/roles are absent. They are scoped to the recorded game sequence, not historical statistics. Summary box-score updates and Core event publication can arrive at different times.

Raw source/probe files: `docs/phase24/summary.json`, `core.json`, `quarter-probeall.json`, `quarter-probe1.json`, `production-snapshot.json`. Recorded test copies are in `tests/fixtures/phase24-summary.json` and `phase24-core.json`; synthetic test corrections never enter runtime code.

## Verification

- TypeScript typecheck, ESLint and production build passed.
- **60 unit tests passed** across ten files, including added box identity/portrait/role, coordinate rejection, shooter attribution, through-event splits and missing-quarter coverage.
- Final production regression suite: **all 76 passed (2.7 minutes)**, including the additional nested-scroll/focus restoration check.
- Focused coverage: all player/portrait/row/body triggers, correct independent identities, live and completed fixtures, nested Back/close, previous/next, profile navigation, season request deduplication, no redundant box fetch, live popup statistics updating during polling, stored tracker targets, silhouette/season/coordinate unavailable states, corrected/removed plays, invalid API input, keyboard focus wrap/restoration, background scroll lock and accessibility/overflow at 390, 768, 1024, 1440 and 1920px.
- Real live browser verification: with Tyrese Maxey's overlay open, game 401909089 remained in progress and automatic responses arrived at **23:55:44.549 and 23:55:55.103 UTC** (00:55 London, 21 October). The event count advanced **152 ? 153** while the dialog stayed open; both responses shared 28 player rows. A subsequent real completed-game Stats-row action opened Paul George's overlay for 401909088, with final score **Boston 113 / Detroit 121**, 499 plays and 28 box rows. See `docs/phase24/browser-provider-verification.json`.

## Screenshots and review

Four requested captures use actual live-provider data from the production build:

1. `docs/screenshots/phase24-player-desktop-1440.png`
2. `docs/screenshots/phase24-player-mobile-390.png`
3. `docs/screenshots/phase24-play-desktop-1440.png`
4. `docs/screenshots/phase24-play-mobile-390.png`

Additional captures: `phase24-play-shot-mobile-390.png` (coordinate detail) and `phase24-player-completed-1440.png` (real completed-game player overlay). Capture/verification scripts: `.tools/phase24-capture.mjs` and `.tools/phase24-verify-live.mjs`.

Review: http://127.0.0.1:3001/games/espn-401909089?section=feed ? select a player name/portrait or a play body; Stats rows also open player details.

## Files changed

Runtime: `src/domain/player.ts`, `ecosystem.ts`, `game-detail.ts`, `detail-performance.ts`, `play-by-play.ts`; `src/data/espn/play-by-play-mapping.ts`; `src/app/api/game-player/route.ts`; `src/components/game/game-details.tsx`, `game-detail-data.ts`, `game-detail-views.tsx`, `game-centre.tsx`, `live-plays.tsx`, `game-context.tsx`; `src/components/explore/game-box.tsx`, `player-headshot.tsx`; `src/app/game-details.css`, `layout.tsx`.

Tests: `tests/game-detail.test.ts`, `tests/play-by-play.test.ts`, `tests/e2e/game-details.spec.ts`, `tests/e2e/play-by-play.spec.ts`, `tests/e2e/ecosystem.spec.ts`, and recorded fixtures. Existing link-navigation expectations were updated to assert the requested overlay followed by its explicit full-profile action.

No Phase 2.5 or unrelated functionality was started.
