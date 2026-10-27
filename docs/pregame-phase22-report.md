# Phase 2.2 — Pregame overview and team comparisons

20 October 2026. Implemented only inside the upcoming fixture's **Game → Overview** content. The approved home screen, matchup header, fixture selector and primary tabs were not redesigned. Live/final overview content, Feed, team statistics, player links, favourites and My Tracker remain intact.

## Implemented experience

- Compact matchup context adds the verified season/competition and conference position when ranked results exist. It avoids repeating the prominent logos, records, venue and local tip-off from the persistent header.
- A dense comparison table shows away value, metric definition and home value. Ten core metrics are supported. Missing values remain dashes; if no equivalent metrics are available for both teams, a deliberate unavailable section replaces a wall of empty rows.
- Comparison bars use the metric's typical direction: lower opponent points and turnovers, higher output for the other supported metrics. Values and explanations remain visible independently of colour. They never declare an overall winner.
- Recent form has separate team disclosures, compact W/L sequences and up to five verified completed games before the selected tip-off. Expanded results include date, season, competition, opponent, home/away designation, final score and a stable game-centre link.
- Home/away performance uses the provider's road/home records. Winning percentage is calculated only from those explicit verified wins/losses; 0–0 yields “No games recorded,” not a misleading 0% performance. No split is inferred from a partial schedule.
- Head-to-head shows the newest two verified meetings, with an expandable remainder. History is bounded to the selected season and preceding season, in the same competition type. Each result labels its own season/competition and winner.
- Broadcast listings are presented neutrally. A US network name does not imply UK or other regional availability. Missing listings and unverified regional rights remain explicit.
- **View Full Comparison** opens a native modal: full-height on mobile and a spacious desktop panel. Scoring, Playmaking, Rebounding, Defence and Advanced categories use keyboard-accessible tabs. Metric explanations work with pointer, touch and keyboard. Escape closes an explanation before closing the modal; modality, focus wrapping, focus restoration and reduced-motion handling reuse the shared systems.
- Skeletons, recoverable request errors, restrained disclosure motion and category fades reuse existing tokens. No competing motion framework or dependency was introduced.

Used the installed [UI/UX Pro Max skill](C:/Users/User/.agents/skills/ui-ux-pro-max/SKILL.md), including verified compact-control semantics guidance. Earlier REAL references informed density and hierarchy; PROJECT 01's charcoal/cyan identity and existing components remain.

## Data audit and sources

The new `/api/pregame?game=espn-{id}` route composes **existing ESPN services**, using the existing validated team/game IDs and cached raw resources. No additional scraper or upstream data source was added.

| Information | Existing source and verification |
|---|---|
| Game season/competition | Summary `header.season.year/type`; no date-based season guess |
| Team averages | Season/competition/team-validated team statistics endpoint |
| PPG / opponent PPG fallback | Explicit standings averages, only after recorded games exist |
| Standings / splits | Season/competition-validated standings; explicit home/road records |
| Recent form | Team schedule, individual event year/type, completed status and verified unequal totals before tip-off |
| Meetings | Current and preceding season's schedules, same competition, stable opposing team IDs |
| Broadcasts | Existing summary broadcast names; no regional-rights inference |

The data model carries game ID, source, season, competition, snapshot time, cutoff, stale state, warnings, team identities, metric units/definitions, record/split data and per-result season/competition. It rejects mismatched client game/team responses. The same statistical definition and season/competition apply to both sides.

Season resources and the assembled response cache for five minutes; preceding-season schedules cache for one hour. Existing stale-cache disclosure is retained. A bounded client cache deduplicates requests and retains data across Game-tab remounts, modal opening and category changes. There is no new polling loop. Missing season/competition metadata withholds season data rather than requesting a guessed period.

Historical schedules sometimes use `record[].displayValue` rather than `summary`. The comparison adapter normalizes those supplied records and preserves verified scores. A malformed individual entry is omitted with a data note, instead of losing every valid result. These partially readable schedules are never treated as complete evidence for home/away splits.

## Working data versus unavailable data

The [production data audit](pregame-phase22-data-audit.json) records actual, unintercepted responses:

- **2026–27 regular season, Boston–Detroit:** explicit 0–0 overall/home/road records, unranked conference context, NBC listing and **four verified 2025–26 regular-season meetings**. Current-season averages and recent form are unavailable because no completed games are recorded yet. Both current team-statistics endpoints are unpublished; previous-season averages are not substituted.
- **2026–27 regular season, Philadelphia–New York:** the same honest start-of-season states and four labelled historical meetings; provider-listed broadcasts are retained without regional guarantees.
- **Historical 2025–26 API audit, Toronto–Boston:** all **13 supported metrics** populate for both teams, plus verified results and seven meetings. This demonstrates the real mapping on published statistics; it is an API audit, not a claim to reconstruct a pregame snapshot from that past date. The finished-game UI was not replaced by a pregame screen.

| Supported metric | Definition/source requirement |
|---|---|
| Points / opponent points | Explicit per-game averages; standings fallback allowed after games exist |
| FG%, 3P%, FT% | Explicit percentage fields, on the same 0–100 scale |
| Rebounds, assists, turnovers, steals, blocks | Explicit per-game fields, never totals relabelled as averages |
| Assist/turnover ratio | Provider-supplied ratio; not recalculated from rounded averages |
| Offensive/defensive rebounds | Explicit per-game fields |

Still unavailable: split scoring/conceding averages, verified regional broadcast/streaming rights, offensive/defensive/net ratings, pace, effective field-goal percentage and true shooting percentage. The Advanced category explains this instead of displaying estimates or ambiguous provider “efficiency” fields. Future support requires a reliable source with explicit season, competition, split coverage, units and consistent metric definitions. No inferred advanced calculations were added.

Conference rank is never taken from the provider's projected playoff-seed field. Zero-game averages are suppressed. Recent results with missing/tied totals, wrong season/competition or dates at/after the selected tip-off are not represented as completed form.

## Files and components

New application files:

- `src/domain/team-comparison.ts`: reusable validated model, definitions, comparison-direction logic and verified result selection.
- `src/data/espn/pregame-mapping.ts`: strict averages, records, splits and schedule normalization.
- `src/data/espn/pregame-server.ts`: summary-based context, composition, cache and provenance.
- `src/app/api/pregame/route.ts`: bounded game-ID API boundary.
- `src/components/game/use-pregame.ts`: bounded, deduplicated client resource cache and response identity checks.
- `src/components/game/pregame-overview.tsx`: comparison rows/help, result lists, disclosures, splits, broadcast section and Full Comparison modal.
- `src/app/pregame.css`: scoped responsive content and modal presentation.

Existing files refined:

- `src/components/game/game-centre.tsx`: upcoming Overview mounts PregameOverview; other content branches stay intact.
- `src/data/espn/ecosystem-server.ts`: exports the existing raw-resource reader and accepts an optional cache TTL; explorer calls continue using it.
- `src/app/layout.tsx`: imports the scoped pregame CSS.

Reused: `ContentPanel`, `LoadingSkeleton`, `trapDialogFocus`, shared motion durations, reduced-motion detection, existing game/team links, existing persistent game navigation and browser-local timezone handling. No dependency, authentication, payment, community or player-tab features were added.

Tests/fixtures: `tests/pregame.test.ts`, `tests/e2e/pregame.spec.ts`, `tests/fixtures/pregame-statistics.json`, `pregame-historical-schedule.json`, `pregame-model.ts`. The model fixture is **test-only synthetic response data**, never imported by runtime application code. The statistics and historical-schedule JSON are recorded provider examples.

## Verification

- TypeScript typecheck, ESLint and production build pass.
- **43 unit tests pass**, including 10 new comparison tests: metric identity/period/unit validation, percentage bounds, zero-game suppression, meaningful bar direction, explicit split records, result cutoff/deduplication, malformed schedule recovery, actual historical record format, assembly identity and missing-context withholding.
- **55 browser flows are verified**, comprising all 48 existing regression flows and seven pregame flows. After the continuation audit, the seven pregame flows were rerun together and passed. These exercise populated regular-season responses, preseason labels, absent averages/history/broadcasts, modal categories, metric explanations, keyboard/focus/Escape, explicit focus wrapping, backdrop closing, phone viewport fit, invalid API requests, reduced motion, loading/error retry, fixture races, response identity checks, recent-result routes, Game/Feed switching and request reuse.
- Requested widths **390, 768, 1024, 1440 and 1920px** pass overflow checks for the page and full comparison. Populated test-response views pass axe at all five widths; actual-provider overview and modal scans at 390/1440px report zero violations.
- Actual production review reports no browser page errors or overflow. [Browser audit](pregame-phase22-browser-audit.json).

A continuation audit confirmed that the saved implementation and screenshots survived the reported reset, both local servers responded, and every linked screenshot existed. The new mobile-size check waits for the opening animation to finish before measuring the sheet.

The source audit and screenshots are distinct from browser-test request interception. Mobile touch is emulated; physical devices, other browser engines and a controlled performance benchmark were not verified.

## Screenshots

Actual current-provider state, with current-season gaps shown honestly:

| Screen | Mobile | Desktop |
|---|---|---|
| Game overview | [390px](screenshots/pregame-phase22-game-390.png) | [1440px](screenshots/pregame-phase22-game-1440.png) |
| Full Comparison | [390px](screenshots/pregame-phase22-full-390.png) | [1440px](screenshots/pregame-phase22-full-1440.png) |

Additional production widths: [768px overview](screenshots/pregame-phase22-game-768.png), [1024px overview](screenshots/pregame-phase22-game-1024.png), [1920px overview](screenshots/pregame-phase22-game-1920.png); corresponding Full Comparison captures use the same width suffixes.

Populated interaction verification — **synthetic browser-test responses, not current ESPN figures**: [mobile overview](screenshots/pregame-test-data-overview-390.png), [desktop overview](screenshots/pregame-test-data-overview-1440.png), [mobile Full Comparison](screenshots/pregame-test-data-full-390.png), [desktop Full Comparison](screenshots/pregame-test-data-full-1440.png).

## Limits and running

ESPN remains an unofficial development source, subject to delays, corrections, outages and existing licensing constraints. Season snapshots are explicitly not historical pre-tip-off reconstructions. Meetings cover at most two seasons in the selected competition. Partial schedules may omit unreadable games. Missing sections have complete UI structure, but are not claimed as populated live capabilities.

Phase 2.3 player-tab work and Phase 2.4 community work were not started.

Preview: http://127.0.0.1:3200/games/espn-401909088

From `C:\Users\User\Documents\real`:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```
