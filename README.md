# PROJECT 01

An original black-and-turquoise NBA scores app. Existing fictional demo plus a selectable unofficial ESPN preview for local visual evaluation.

## Run

The workspace has a portable Node 24 runtime under ignored `.tools`. From the project directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Open http://127.0.0.1:3000. On another machine install Node 24, then `npm ci` and `npm run dev`.

## Data sources

Fictional demo is the default: 24 deterministic fixtures, three demo dates, local follows and an explicit sample score update/reset.

Open Preferences → Data source → ESPN preview for authentic teams/logos, schedules, available scores/quarters and basic game previews. This unofficial preview is for local evaluation; it may be delayed or unavailable and does not establish commercial redistribution/logo rights. Demo and ESPN favourites are stored separately. Mode selection persists locally.

ESPN schedule dates use New York calendar days; tip-offs display London time. Select any date with the calendar. October 18, 2026 returned no fixtures in verification. Useful observed historical dates: April 5, 2026 (11 games) and June 5, 2026 (one final). Direct local preview: `/?mode=espn&date=2026-04-05`. Real game preview: `/games/espn-401859964`.

Scores/explorer use manual refresh. My Tracker refreshes visible games every 60 seconds, deduplicated by game. Refresh requests use a server-side cache. Receipt timestamps and stale warnings remain visible. Provider failures do not substitute demo scores.

## Checks

`npm run typecheck`, `npm run lint`, `npm test`, `npm run build`. With the app running: `npm run test:e2e`.

31 unit tests include provider normalization/caching failures; browser tests preserve the original demo flows and add ESPN mode, isolated favourites, search/deep links, empty/error/retry, malformed contracts, stale data, broken logos and request race checks. Tests use minimized recorded JSON contracts; no image assets are bundled.

Read docs/data-provider-boundary.md and docs/espn-phase-report.md for implementation, endpoint evidence, verification and limits. Font source/licence: public/fonts/OFL.txt. Team images are remote URLs, not included assets. No accounts, connected community service, payments or deployment. The community view is a clearly labelled local demonstration.

Current review: Player Headshots + My Tracker MVP. See `docs/headshots-tracker-report.md` for implementation, screenshots and limits. Phase 2 NBA team/player ecosystem is retained. All 30 teams and rosters are supported through stable-ID routes. See `docs/phase2-report.md` for endpoints, image provenance, live audit and exact URLs.

## Phase 2: teams and players

NBA heading and More → NBA open `/teams`; dashboard Standings opens `/standings`. Every real team has `/teams/{ESPN ID}` with Overview/Roster/Schedule/Stats. Roster, leaders and real game box-score player links open `/players/{ESPN player ID}`. Explicit `season=2027` means 2026–27; `phase=1/2/3` means preseason/regular/postseason.

Live audit verified all 30 team rosters (539 unique player IDs), all 30 schedules and six divisions. Current regular-season results/statistics are not fabricated when unpublished. Player images now use ID-matched ESPN portraits for this local MVP, with optimised loading and silhouette fallback. Commercial rights and photo season remain unverified; see `.env.example` and `docs/headshots-tracker-report.md`.

Phase 2 validation: build, typecheck, lint, 24 unit tests and 28 browser flows passed. [Full Phase 2 report](docs/phase2-report.md), [live audit](docs/phase2-live-audit.json), [screenshots](docs/screenshots/phase2-overview.png).

## My Tracker

Open `/tracker` from the primary navigation. Save player targets, edit/archive/remove them and organise them into named collections. Free limits: 5 non-archived targets and 1 collection. All ten supported statistics use the game centre provider box score; at-most targets settle only at final. Local storage only, no payments. See [implementation and verification](docs/headshots-tracker-report.md).

Current MVP validation: typecheck, lint, production build, 31 unit tests and 33 browser flows passed.

## Application experience and interaction overhaul

The app now shares motion tokens, focus handling, portrait enlargement, skeletons, route feedback and action notices. Tracker targets provide expandable details and removal undo. Desktop navigation and content adapt from 1024px; the existing mobile navigation remains. Read [implementation, reference and verification](docs/experience-overhaul-report.md). Production review: http://127.0.0.1:3100. Standard development command remains unchanged.

## NBA home and game-centre navigation

The home screen now has compact fixtures, date navigation and Your NBA personalisation. See the [home implementation report](docs/home-phase1-report.md).

Phase 2.1 adds neighbouring-game navigation, a responsive matchup header and accessible Feed/Game/team tabs while retaining existing content. Typecheck, lint, production build, 33 unit tests and 48 browser tests pass. Read the [game-centre report and screenshots](docs/game-phase21-report.md). Current production review: http://127.0.0.1:3200/games/espn-401909088.

Phase 2.2 adds the upcoming Game-tab overview, season-safe comparison, recent form, explicit home/away records, labelled meetings, neutral broadcasts and Full Comparison modal. Missing current-season/advanced data remains unavailable. Typecheck, lint, build, 43 unit tests and 55 browser flows verified. See the [pregame report, data audit and screenshots](docs/pregame-phase22-report.md).

Phase 2.2.1 adds an explicit verified previous-season comparison, content-aware desktop modal sizing and mobile-clearance/history regression checks. Navigation appearance is unchanged. Typecheck, lint, build, 46 unit tests and all 59 browser tests pass. See [polish report and real-data screenshots](docs/pregame-phase221-report.md).

Phase 2.3 adds current NBA rosters to both real-team Game Centre tabs, season-labelled player averages, general injury reports, shared portrait enlargement, player favourites and contextual My Tracker entry. See [implementation, source limits, validation and live screenshots](docs/phase23-report.md). No Phase 2.4 work is included.

NBA live play-by-play now uses verified ESPN Core events with Summary fallback, automatic score/feed updates, stable-ID correction handling and visible polling-failure states. See [endpoint audit, actual live latency and verification](docs/play-by-play-report.md).

The Game Centre now has a charcoal-and-gold scoreboard card, compact event timeline, responsive context column and consistent comparison/statistics containers. See [visual changes, screenshots and verification](docs/game-visual-report.md). Live integration is unchanged.

Phase 2.4 adds in-game player and play-detail overlays, shared live box-score data, cached season averages, recorded shooting context and My Tracker targets. See [implementation, provider limitations, tests and desktop/mobile captures](docs/phase24-report.md).
