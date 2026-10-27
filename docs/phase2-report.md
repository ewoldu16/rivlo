# Phase 2 — NBA team and player ecosystem

Implemented in the existing project at `C:\Users\User\Documents\real`. The approved design, Next.js runtime and existing routes/features remain. No deployment, commercial provider, tracker, betting, accounts or notification system added.

## Implemented features

- `/teams`: all 30 NBA teams, official provider identities/logos and stable-ID links. Available through the dashboard NBA heading and More → NBA.
- `/teams/[id]`: Overview / Roster / Schedule / Stats, with explicit season and competition selectors. Overview includes source conference/division, selected-competition record, conference position when meaningful, division position when published, win percentage, next game, recent results and conference context.
- All six divisions are resolved from season-scoped conference child groups and division standings using stable provider IDs. No hardcoded roster or team-name matching. A conference is never labelled as a division.
- Rosters include full provider names, jersey, position, height, current bio age where available, status and reusable image/fallback component. Every roster entry links to a stable player profile. All provider roster entries are retained, including non-starter/camp/other statuses; missing contract classifications are not invented.
- Schedules show published dates/times in London, home/away designation, opponent identity links, game state and available final scores. Game links reuse the original game centre.
- Team Stats displays verified selected-season statistics and source leaders when published. Historical 2025–26 statistics/leaders were actually loaded and inspected; they are never silently substituted into 2026–27.
- `/standings`: East and West, team identity links, W/L, percentage, games behind and source order when the competition has results. Zero-game seasons are explicitly unranked, with no invented positions.
- `/players/[id]`: player bio, current provider team link, selected-season roster membership check, season/competition-scoped averages from published game logs, recent/game-by-game values, game-time team links and available experience/draft/birthplace information. Current bio metadata is distinguished from historical game teams.
- Game-centre Stats now loads real box scores when available, displaying the actual game season/competition and game-time team groups. Every player links to a profile with that game's season/competition context.
- Dashboard team identities are independent sibling links, not anchors nested inside the game link. Favourite hit areas remain independent and accessible. Game-centre and Favourites team identities also link to teams. Native browser back and direct URLs work.

## Live coverage verified

Actual audit: `docs/phase2-live-audit.json` (18 October 2026).

| Item | Result |
|---|---:|
| NBA teams | 30 |
| Verified 2026–27 provider rosters | 30 |
| Unique player IDs / roster slots | 539 / 539 |
| Teams with published 2026–27 regular-season schedules | 30 |
| Divisions resolved | 6 |
| Regular-season records | All 30 at 0–0; unranked |
| ID-matched headshot URL candidates | 532 |
| Photographs with verified 2026–27 season provenance | 0 |

This verifies all 30 team/roster resources; it does not claim that all 539 individual profile endpoints were separately probed. Player routes are generic stable-ID routes. Real player/profile, historical leaders → player, roster and game box-score journeys were sampled live and covered with deterministic browser contracts.

## Data endpoints and season rules

ESPN season `2027` represents 2026–27. Competition types: 1 preseason, 2 regular season, 3 postseason.

Fixed upstream origins and consumed paths:

1. `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/`
   - `teams` and `teams/{teamId}`
   - `teams/{teamId}/roster?season={year}`
   - `teams/{teamId}/schedule?season={year}&seasontype={type}`
   - `teams/{teamId}/statistics?season={year}&seasontype={type}`
   - `summary?event={gameId}` (real box scores and existing game information)
2. `https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season={year}&seasontype={type}`
3. `https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/`
   - `athletes/{playerId}`
   - `athletes/{playerId}/gamelog?season={year}`
4. `https://sports.core.api.espn.com/v2/sports/basketball/leagues/nba/`
   - `seasons/{year}/types/{type}/groups/{conferenceId}/children`
   - `seasons/{year}/types/{type}/groups/{divisionId}` and `/standings/0`
   - `seasons/{year}/types/{type}/teams/{teamId}/leaders`

References are parsed only for numeric stable IDs; arbitrary provider URLs are not followed. The server constructs fixed HTTPS URLs. API inputs validate resource kind, numeric identity, season and competition.

Important findings:

- The athlete overview endpoint returned historical averages even with a 2027 parameter. Those unverified summaries are not consumed. Player averages are calculated from the requested year's and competition's published game logs, with their source game-time team identities preserved.
- Team schedules/statistics can contain an unrelated current-season header alongside `requestedSeason`. Mapping uses the explicit requested-season metadata and validates nested event seasons/competition. Tests cover this distinction.
- Rosters require matching response team ID and year. No invented/hardcoded roster is served as live.
- Source conference standings order is used only after results exist; projected BPI seed values are not used as rankings.
- No historical values are relabelled as current. Empty/unpublished, mismatched and failed resources are explained visibly.

Reliability: shared bounded server cache (256 entries), URL-keyed request coalescing, 5-minute explorer TTL, existing 24-hour directory caching, timeouts and 5 MB body limit. Individual cache entries have a 24-hour stale-fallback limit and expose receipt timestamps; stale results are marked. Division catalogue requests are deduplicated/cached across team pages. No automatic polling. Client requests abort on navigation, validate contracts and keep data keyed by identity/year/competition. Existing New York schedule-date / London display-time rules remain.

## Player photographs and rights

`PlayerHeadshot` is reused in rosters, profiles, leader rows and real box scores. It fixes dimensions, uses lazy image loading, supports transparent source cutouts, has clean silhouette/error fallback and matches ESPN headshot URLs to the exact stable player ID.

The 532 candidate URLs use the generic form `https://a.espncdn.com/i/headshots/nba/players/full/{playerId}.png`. The provider supplied no reliable media-day/season provenance or permission for this application's reuse. A current URL or file modification date is not treated as proof of a 2026–27 photograph.

**Default: silhouettes. No 2026–27 photograph coverage is claimed.** This is the brief's fallback for unverified/unavailable authorised media, not a claim that silhouette placeholders are official photos. No AI portraits or substitute-player images were generated or used.

`.env.example` documents the opt-in `NEXT_PUBLIC_PLAYER_IMAGE_MODE=espn-evaluation` switch for an appropriately permitted local evaluation. Opting in marks the images as unverified evaluation photos; it does not establish rights or verify season. `PlayerHeadshot` also accepts licensed source metadata (`url`, `season`, `rightsConfirmed`) so a licensed media integration can replace evaluation images centrally. No image files are bundled.

Release restrictions: unofficial endpoints have no established provider agreement or guaranteed availability. Data redistribution, logos and player-image rights have not been cleared for a public commercial release. [ESPN's own photo guidance](https://support.espn.com/hc/en-us/articles/360039548891-How-can-I-get-a-copy-of-an-ESPN-com-photo) says its photographs are generally sourced for ESPN.com use. Provider access alone is not a commercial licence. A separately authorised/licensed media/data arrangement remains necessary before a public commercial release.

## Files and routes

New routes: `src/app/teams/page.tsx`, `src/app/teams/[id]/page.tsx`, `src/app/players/[id]/page.tsx`, `src/app/standings/page.tsx`, `src/app/api/explore/route.ts`.

New shared implementation:
- `src/domain/ecosystem.ts`, `src/domain/explore-contracts.ts`
- `src/data/espn/ecosystem-mapping.ts`, `src/data/espn/ecosystem-server.ts`
- `src/components/explore/explorer.tsx`, `shared.tsx`, `player-headshot.tsx`, `game-box.tsx`
- `src/app/explore.css`, `.env.example`

Updated: existing ESPN cache, App standings control, dashboard identities/NBA directory entry, game-centre identities/Stats, Favourites identity links, More's NBA link and layout stylesheet imports. Existing domain preferences, demo snapshots, search, follows, onboarding and community remain intact.

Stable `playerId`, `gameId`, season, competition, game-time team and stat category keys are present in normalized game logs/box-score structures for a future tracker. No target/collection/tracker feature is implemented.

## Validation and visual evidence

- Production build, TypeScript typecheck and ESLint passed.
- All 24 unit tests and 28 browser flows passed.
- Added tests cover all 30 route identities, conference navigation, zero-game rankings, roster identity/year validation, game-log phase separation, headshot ID/host validation, requested-season headers, division ID membership, roster/player/schedule/browser-back journeys, independent fixture links, real box-score profile links, loading/error states, input validation, silhouettes, responsiveness and axe accessibility.
- Existing complete suite remains passing; former unavailable Standings/Stats expectations were updated to test the now-functional destinations, not removed.
- Actual unmocked Chromium pages were captured and inspected at 390/1440px, with additional real-data roster/standings/player/historical-stat captures at 360/768px. No page errors or horizontal overflow in capture runs.
- Live historical leaders → player navigation resolved to `/players/3945274?season=2026&phase=2` with 65 published game logs. This is an explicitly historical view.
- Default 390 × 744 dashboard compared against the approved baseline using Pillow: no changed pixels. Follow hit targets were separated from clickable team identities for functional correctness.

Screenshots: `docs/screenshots/phase2-overview.png`; individual `phase2-team-*`, `phase2-roster-*`, `phase2-schedule-*`, `phase2-standings-*`, `phase2-player-*`, `phase2-boxscore-390.png`, `phase2-historical-stats-*`.

## Open locally

Run: `powershell -ExecutionPolicy Bypass -File .\run.ps1 dev`

- Team: http://127.0.0.1:3000/teams/13?season=2027
- Roster: http://127.0.0.1:3000/teams/13?season=2027&tab=roster
- Standings: http://127.0.0.1:3000/standings?season=2027&phase=2
- Player with available preseason statistics: http://127.0.0.1:3000/players/3945274?season=2027&phase=1
- Historical team statistics/leaders: http://127.0.0.1:3000/teams/13?season=2026&phase=2&tab=stats
- Historical real box score: http://127.0.0.1:3000/games/espn-401859964 (select Stats)

## Known availability limits

2026–27 regular-season statistics, results and meaningful rankings were not published at verification; no prior-season substitutes are shown. Rosters are provider snapshots and can change through trades/cuts/two-way assignments. Age/current bio fields are not historical bio snapshots. Headshot season and usage rights remain unverified, so default imagery is silhouettes. Player/box-score/leader coverage varies by source; unavailable resources remain explicit, not fabricated. The real play-by-play feature from earlier phases remains outside this phase.
