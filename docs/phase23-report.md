# Phase 2.3 ? NBA Game Centre team rosters

Implemented 20 October 2026. Scope ends at Phase 2.3.

Both ESPN Game Centre team tabs now show the selected team's current provider roster. Feed, Game, the matchup header, comparison, live box scores, demo views and global navigation retain their existing implementations.

- Compact linked team identity, conference, current regular-season record and full roster count.
- Prominent ID-matched portraits, names, jersey numbers, positions, report/unreported states, statistics and independent favourite/tracker controls. The rest of each row links to the player profile.
- Existing shared portrait dialog: backdrop, Escape, focus trapping/restoration, scroll locking and silhouette fallback are reused.
- Statistic selection, stable descending sort with missing values last, alphabetical sort, G/F/C filters including combo positions, and reset order. Controls persist between teams during the game visit.
- Current-season default; explicit previous-season choices. Historical averages apply to the current roster, not a reconstructed historical roster. All published regular-season games for that player, including games for other teams, contribute.
- Mobile displays one selected statistic. Desktop displays that statistic plus three aligned columns; tablet displays one additional column. Actions use 44px targets; reduced motion is respected.
- Player favourites persist on this device and appear on the existing Favourites page. Existing team favourites retain their storage and behavior. Corrupt player storage is not overwritten.
- My Tracker links prefill the existing editor's game, date, player and compatible category. Existing participants verification, provisional-participation wording, categories, validation, limits and persistence perform target creation. Roster controls do not write tracker records.

## Data sources and limits

Uses the existing unofficial ESPN provider boundary, identity normalization, strict headshot URL matching, validated game logs, standings mapping and bounded/coalescing cache. No new provider credentials or dependencies.

- [Boston roster feed](https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/2/roster?season=2027) and corresponding Detroit team 8 feed: current membership, IDs, jersey, positions, supplied photos and dated general injury reports.
- [Current regular-season standings](https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2027&seasontype=2): conference and W?L, checked against season/phase/team.
- [Player regular-season game logs](https://site.web.api.espn.com/apis/common/v3/sports/basketball/nba/athletes/4065648/gamelog?season=2026): checked season filters and competition labels; joined by player ID. Statistics are calculated from published logs, not invented season-summary values.

Categories: PPG, RPG, APG, FG%, 3P%, MPG, SPG, BPG. Counting categories and minutes average numeric game values. Shooting percentages use summed made/attempted pairs, never an average of game percentages. No attempts, missing/invalid components or absent logs produce a dash, not zero. Partial/missing game components conservatively suppress that category. No automatic previous-season substitution.

Live audit: Boston returned 17 players and Detroit 18. Both teams' 2026?27 player logs were empty at verification; all current player statistics therefore correctly display dashes. Explicit 2025?26 selection returned historical game-log averages for players with published logs; rookies/absent logs retain dashes. The current team records were provider-reported 0?0.

Availability supports dated Questionable, Doubtful, Out and Probable injury designations. Current live feeds included Out reports for Devin Carter and Taurean Prince. These are general reports, not confirmed game-specific availability. Other/undated designations and absent reports show Unreported. Roster Active is never treated as Available. Report timestamps are retained and shown in the status tooltip. The provider paths used do not verify game-specific clearance or a complete official injury list.

Current membership is re-read from the provider's current-season roster; historical fixture tabs still explicitly show current membership. Trades/signings/waivers/two-way membership are reflected only when the provider updates its roster; there is no inferred transaction history or verified contract-type badge. Photos may show older uniforms; photo season is unverified. All data may lag official sources.

Requests: roster-specific endpoint avoids the team profile's unrelated schedule/leaders/division fetches. Four concurrent player-log requests maximum, five-minute shared server caching and client team/season caching; statistic/sort/position changes do not fetch. Existing stale fallback remains visibly labelled. Both the response team ID and statistics season are checked before display.

Live audit files: `docs/phase23-live-2.json`, `phase23-live-8.json`, `phase23-live-2-2026.json`, `phase23-live-8-2026.json`, `phase23-live-game.json`.

## Files changed

- `src/domain/roster.ts`: validated roster contract, averages and stable selection.
- `src/data/espn/roster-server.ts`, `src/app/api/roster/route.ts`: focused cached roster/statistics service and validated route.
- `src/data/espn/ecosystem-mapping.ts`: dated injury designation mapping.
- `src/components/game/team-roster.tsx`, `game-centre.tsx`: team roster experience and tab integration.
- `src/components/account/player-favourites.tsx`, `src/components/app.tsx`: persistent player favourite actions and existing-page listing.
- `src/components/tracker/tracker.tsx`: validated contextual editor prefill.
- `src/app/roster.css`, `src/app/layout.tsx`: scoped responsive styling and import.
- `tests/roster.test.ts`, `tests/e2e/roster.spec.ts`, `tests/fixtures/phase23-roster-2.json`, `phase23-roster-8.json`: reliability and interaction coverage with recorded provider rosters. Synthetic browser-test averages/injury cases never enter runtime code.
- `.tools/phase23-capture.mjs`, this report, audit JSON and `docs/screenshots/phase23-*.png`: capture script and verification evidence.
- `README.md`: Phase 2.3 entry and report link.
- `AGENTS.md`: generated automatically by this installed Next.js when starting development; its relevant route documentation was read.

## Verification

TypeScript typecheck, ESLint, production build: passed. Unit tests: 50 passed across 8 files.

Production browser suite: all 64 passed (2.3 minutes), including all 5 new roster flows. Ran with PLAYWRIGHT_BASE_URL=http://127.0.0.1:3001 against the production build. Production review: http://127.0.0.1:3001/games/espn-401909088?section=away.

Focused roster checks cover correct team/identity, image mapping/fallback, team switches and cached revisits, profile navigation, independent favourites and persistence, tracker editor prefill and saved-target persistence, statistic/season selection, sort/filter behavior, missing statistics, supported/unsupported injury statuses, invalid responses/retry, keyboard portrait closing/focus restoration, backdrop closing, scroll locking, reduced motion, accessibility and no horizontal overflow at 390, 768, 1024, 1440 and 1920px. Existing shared portrait tests cover focus trapping and touch opening.

Development-server run: 60/63 passed before the additional fallback/cache test. Three existing app/navigation/onboarding tests failed under the development server; all nine tests in those affected files passed on a production-server rerun. One recorded failure explicitly showed the Next.js dev portal intercepting a navigation click. Production verification is the final application result.

## Requested screenshots

These five are actual live-provider UI captures from the production build, not synthetic browser fixtures:

1. `docs/screenshots/phase23-live-boston-390.png`
2. `docs/screenshots/phase23-live-detroit-390.png`
3. `docs/screenshots/phase23-live-desktop-1440.png`
4. `docs/screenshots/phase23-live-portrait-390.png`
5. `docs/screenshots/phase23-live-alternative-stat-1440.png` ? APG, explicitly selected previous season.

Additional `phase23-boston-*`, `phase23-detroit-*`, `phase23-portrait-*` and `phase23-alternative-stat-*` screenshots are deterministic browser-test fixtures with synthetic statistics/injury cases, not live accuracy evidence.

Remaining limitations are provider coverage described above: current-season statistics are not yet published, injuries are general reports, historical roster reconstruction/contract verification and game-specific medical clearance are unavailable. No Phase 2.4 or AI Sports Search work was started.
