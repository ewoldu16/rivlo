# Rivlo NBA play-by-play investigation and integration

Verified on 20 October 2026 against live Boston Celtics at Detroit Pistons, ESPN game **401909088**. All endpoint claims below come from saved HTTP JSON, not assumptions about ESPN coverage.

## Root cause and existing request path

The reported wording, ?Live feed is not provided by this source?, is not a literal string in this checkout. Its equivalent was **?Play-by-play is not provided by this data source.?** in `src/components/game/game-centre.tsx`.

The exact old condition was `tab === 'Play-by-play'`, followed by `illustrative = game.mode === 'demo' && game.id === 'game-1-0'`. Only that one fictional game rendered events. Every real ESPN game took the unavailable-text branch without checking ESPN's response. `mapSummary()` in `src/data/espn/mapping.ts` mapped the header/score/venue but discarded the top-level `plays` array, and the normalized snapshot contract did not contain events. The browser fetched on initial load/manual refresh; it had no score/feed polling. Existing server live-summary caching was 30 seconds.

Existing game requests:

- Browser `/api/nba?game=espn-ID` ? `getEspnGame()` ? `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=ID`.
- Browser `/api/nba?date=YYYY-MM-DD` ? ESPN `scoreboard?dates=YYYYMMDD`, plus cached ESPN `teams` directory.
- Existing `/api/explore?kind=box&id=ID` and tracker box-score reads also reuse `getSummary()`.
- Core plays and CDN play-by-play were **not** used by the Game Centre before this change.

This was an application integration gap, not evidence that ESPN lacked NBA play-by-play.

## Same-game endpoint verification

Initial parallel requests: **21:26:46?47 UTC (22:26:46?47 London)**. All three returned HTTP-success JSON for game 401909088 while it was in progress.

| Source | Verified endpoint | Initial events | Last event | Initial request time | Observed cache header |
|---|---|---:|---|---:|---|
| Summary | [summary?event=401909088](https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=401909088) | 467 | 401909088691, Q4 2:02 | 163 ms | max-age=1 |
| Core | [events/401909088/competitions/401909088/plays?limit=1000](https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/events/401909088/competitions/401909088/plays?limit=1000) | 467, one page | 401909088691, Q4 2:02 | 877 ms | max-age=7, stale-while-revalidate=7200 |
| CDN | [playbyplay?xhr=1&gameId=401909088](https://cdn.espn.com/core/nba/playbyplay?xhr=1&gameId=401909088) | 465 | 401909088688, Q4 2:04 | 384 ms | max-age=300 |

Summary has top-level `plays`; Core has paginated `items`; CDN has `gamepackageJSON.plays`. Each supplied stable event IDs, sequence numbers, period, clock, text, scores, athlete identifiers and `wallclock` timestamps. Core uses athlete/team `$ref` URLs and additionally supplies `valid`, `modified`, `shortText` and participation roles. Athlete identifiers are extracted from these URLs without making per-player network calls; names are joined from the Summary box score. Missing names retain the provider's play description/type.

Example verified event: `401909088691`, sequence 691, Paul George makes free throw 1 of 2, Q4 2:02, Boston 104 / Detroit 114, participant 4251, wallclock `2026-10-20T21:26:06Z`. The description, identity and score are provider data, not generated commentary.

A repeated comparison sampled each source **24 times** between **21:27:01 and 21:31:12 UTC**, nominally every 10 seconds plus request duration. Core advanced from **467 to 483 events**, Summary from **467 to 482**, and CDN stayed at **465** throughout. For 15 newly observed IDs seen in both Core and Summary, Core's median first-observation lead was **10.87 seconds**, maximum **32.58 seconds**; one pair was effectively simultaneous. Core was the freshest and most complete source observed in this window, despite its larger response and slower network request. This is an observed result for this game/window, not a universal ESPN guarantee.

## Implementation

- Extended the existing validated NBA snapshot with optional `playByPlay`. The game route remains `/api/nba?game=...`; no parallel scoreboard or duplicate browser feed subscription was introduced.
- **Core primary, Summary fallback.** Reads every Core page (1000/page, bounded to 10 pages), verifies the response game reference/page identity, and discloses partial/unreadable data. If Core fails or has no usable events, uses verified Summary events. If a stale Core snapshot is behind a fresh Summary, uses Summary. CDN is not used because it was materially behind in the live audit.
- Normalizes stable IDs, ordering, periods/clocks, descriptions, teams, players, both scores, wallclock and modification timestamps. Missing values remain null/unreported. No plays, IDs, names, scores or commentary are invented.
- Deduplicates within a snapshot by event ID, accepts the latest corrected version, removes `valid:false` events, and replaces the full displayed snapshot on successful refresh. Removed plays therefore disappear; corrected plays do not append duplicates. Sorting uses provider sequence, not event clock, which can repeat or move during reviews.
- Reuses the existing Game Centre Feed/Play-by-play layout and team marks. Adds player profile links, quarter/overtime filters, truthful empty/partial states and a 100-row initial window with Show older events. Tab selection, filters and scroll are not reset during polling. Fictional demo events remain isolated to demo mode.
- Scores and events update together. If a fresh Core event is sequenced ahead of Summary, its verified score/period/clock update the existing matchup header; missing components preserve the Summary values. Clocks are provider snapshots, not simulated countdowns.
- Visible-page polling: about **10 seconds plus request duration for live games**, 15 seconds for upcoming games, 60 seconds after completion. Home scores use the same automatic request loop. Stops automatic requests while hidden and refreshes immediately on return. Requests do not overlap and route changes abort outstanding work.
- Live server cache TTL is **5 seconds**, with coalescing and bounded shared cache. Upcoming Summary TTL is 10 seconds; recently completed summaries 15 seconds, older finals 15 minutes. Schedule caching is shortened near tip-off and for recent finals. Core cache is 5 seconds live / 15 seconds otherwise. HTTP responses remain `no-store`; provider-side caches cannot be disabled by our application cache settings.
- Failures retain the last successful scores/events, label delayed/cached data and retry with bounded backoff up to 60 seconds. Recovery clears the delay message. Identity mismatches are rejected. Existing stale-cache fallback remains explicitly labelled and can be up to 24 hours old, so cached data is not proof that a game remains live.

Changed runtime files: `src/domain/play-by-play.ts`, `src/domain/nba.ts`, `src/data/espn/play-by-play-mapping.ts`, `src/data/espn/server.ts`, `src/components/app.tsx`, `src/components/game/game-experience.tsx`, `src/components/game/game-centre.tsx`, `src/components/game/live-plays.tsx`, `src/app/game-centre.css`. Existing rosters, portraits, favourites, tracker, comparisons and navigation retain their existing workflows.

## Measured latency and live behavior

`latency-metrics.json` contains the calculations and source observations. Request latency is distinguished from event-publication latency:

| Measurement | Summary | Core | CDN |
|---|---:|---:|---:|
| Median request duration, 24 samples | 154.5 ms | 840 ms | 129.5 ms |
| New events observed | 15 | 16 | 0 |
| Median provider wallclock ? first observation | 39.22 s | 21.35 s | Not measurable: no new events |
| Range, wallclock ? first observation | 29.34?132.71 s | 6.63?121.84 s | Not measurable |

These sampling calculations use request-start timestamps (response receipt adds the request duration), exclude events present in the first sample, and have roughly 10-second sampling uncertainty. Core can publish additional/older-clock events late; the large outliers are retained rather than discarded.

**Actual Rivlo browser test, no provider mocks:**

- At 21:29:32 UTC, game status in progress, Q4 41.0, 475 Core events. Automatic requests arrived about 10.6?11.3 seconds apart.
- At 21:30:05 UTC, 478 events and Q4 30.5, without reload. At 21:30:16, the header clock was 24.1.
- A second live browser session ran 21:31:56?21:33:12 UTC. It automatically changed the score from **Boston 110 / Detroit 117** to **Boston 113 / Detroit 117**, the clock from 18.2 to 7.5 and event count from **483 to 487**.
- Newly rendered latest-event IDs 713, 714 and 715 measured **11.895 s**, **22.587 s** and **28.275 s** from provider wallclock to the matching event row appearing in the DOM. A late-added substitution event, ID 712, measured **108.201 s**. The initial old event and repeated sightings are excluded from these new-event figures.
- Response receipt ? matching DOM row: **6?207 ms, median 68 ms** across the second session. Browser API request times in the first session were approximately 0.63?1.24 seconds after initial development compilation.

These are provider-wallclock-to-observation/render measurements on this machine, not independently synchronized courtside timestamps or video/broadcast latency. ESPN publication delay, caches, late insertions/corrections and local network time all contribute. Polling every 10 seconds does not guarantee a 10-second end-to-end feed.

## Verification and evidence

Typecheck, lint and production build passed. **57 unit tests passed** across nine files. Unit coverage includes actual Summary/Core normalization, identity rejection, missing values, ID deduplication, corrections/removals, pagination, short cache/coalescing, stale results, Summary fallback and polling backoff.

Production browser suite: **all 68 passed (2.5 minutes)** against the production server on port 3001. Focused six-test development run (four new play-by-play flows and two existing Game Centre flows) passed. Browser coverage includes score/event auto-updates, corrections/removals, preserved filters, error retention/recovery/backoff, visibility pause/resume, real player links, overtime, missing values, keyboard operation and accessibility/no overflow at 390, 768, 1024, 1440 and 1920px.

Raw evidence under `docs/play-by-play/`:

- `scoreboard.json`, `initial-audit.json`, `{summary,core,cdn}-initial.json`: exact initial endpoint bodies/headers and live status.
- `{summary,core,cdn}-latest.json`, `live-observations.json`: last endpoint bodies and all source samples.
- `rivlo-live-initial.json`, `browser-live-observations.json`, `browser-live-rendered.json`, `latency-metrics.json`, `core-post-audit.json`: integrated API/browser data and measured timings.

Live screenshots: `docs/screenshots/pbp-live-desktop.png`, `pbp-live-updated.png`, `pbp-live-mobile.png`, `pbp-live-rendered.png`. Scripts: `.tools/pbp-initial.py`, `pbp-monitor.py`, `pbp-browser-live.mjs`, `pbp-rendered-live.mjs`. Recorded test excerpts live in `tests/fixtures/pbp-summary.json` and `pbp-core.json`; synthetic corrections are test-only.

## Remaining limits

ESPN's unofficial endpoints have no freshness/availability SLA. Only one real game was sampled live; consistency across other games/seasons is not established by this audit. CDN's observed delay disqualifies it here, not for every possible game. Summary remains required for game identity, participants and status; a completely unavailable uncached Summary still prevents opening the game rather than inventing metadata. Some Core participants may lack a matching Summary name; their IDs and provider descriptions are retained. Older finals poll every minute for corrections and their cached Summary can persist up to 15 minutes. A deliberately bounded pagination response is labelled partial. No ESPN website push/fauxcast protocol or subsecond guarantee was added.

Review: http://127.0.0.1:3001/games/espn-401909088?section=feed
