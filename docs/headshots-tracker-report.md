# Player Headshots + My Tracker MVP

Implemented in the existing Next.js application on 19 October 2026. Approved scores and game-centre layouts, routes, demo mode, search, favourites, preferences and onboarding are retained. The formerly unavailable Cards slot now opens **My Tracker** at `/tracker`; the other four primary destinations are unchanged.

## Headshots

`src/components/explore/player-headshot.tsx` uses only the exact ESPN provider URL matching the stable numeric athlete ID. No fuzzy names, guessed portraits or generated people are used. Missing, mismatched, disabled or failed images render the existing silhouette. Profiles, roster/leader rows, box scores, the tracker player search and target cards share this component.

Next Image supplies lazy loading, explicit intrinsic dimensions, responsive sizes and an optimised image cache (minimum one day). The allowed remote host/path is constrained in `next.config.mjs`. Portraits are enabled for this local MVP. Set `NEXT_PUBLIC_PLAYER_IMAGE_MODE=silhouette` before building to disable them.

A genuine provider portrait does not establish the year of the photograph or current uniform accuracy. The actual CDN request and local image optimiser both returned HTTP 200. **Commercial usage permission is unresolved.** ESPN's [photo guidance](https://support.espn.com/hc/en-us/articles/360039548891-How-can-I-get-a-copy-of-an-ESPN-com-photo) says photos are generally licensed for ESPN's own use and directs users to the appropriate rights holder. Obtain explicit rights or integrate a licensed media source before commercial distribution. No commercial permission is claimed and nothing was deployed.

## Tracker behaviour

- Add Target: choose a provider schedule date, NBA game, player, statistic, at least/at most, numeric threshold and optional collection. Search within the game's players includes headshots.
- Published box-score participants take precedence. Upcoming games without a box score use both verified season rosters, explicitly labelled **participation unconfirmed**. A roster selection does not assert a confirmed lineup.
- All ten requested categories are supported. PTS, REB, AST, STL and BLK require nonnegative safe integers. 3PM reads a validated made count or the made side of the provider's `3PT` made-attempted pair. PR/PA/RA/PRA require every component; no missing value is filled with zero.
- At least can be reached live, and can revert after official corrections. At most stays Live until completed. Final cards show Reached/Not reached plus a Final source label. Upcoming values are blank; delayed/stale feeds, HTTP failures, unknown/postponed/cancelled games, missing rows/statistics and DNPs are explicit Unavailable states.
- Edit statistics, comparisons, thresholds and collection membership. Game/player are fixed on edit to preserve identity; create a new target to change them. Delete, archive and restore targets. Create, rename and remove collections; removing a collection keeps its targets ungrouped. Select a collection to see its reached/total progress.
- `project01.tracker.v1` is validated, versioned local storage behind a `TrackerRepository` interface. Failed saves are reported and do not claim success. Corrupt storage is not overwritten on load. This is device/browser-local persistence, without accounts, cloud sync, cross-tab conflict resolution or analytics.
- `featureLimits` and `trackerPlan` in `src/domain/tracker.ts` centralise Free (5 non-archived targets, 1 collection) and Premium (unlimited) configuration. Final saved targets continue counting until archived or removed. There is no payment flow or premium unlock control.

## Shared data and refresh

`getSummary` in `src/data/espn/server.ts` provides one shared cached raw summary for the game preview, game-centre box score and tracker. Existing ecosystem normalization remains the only box-score mapper. `/api/tracker` validates numeric event IDs, game and participant team identities, normalized contracts and season-specific rosters. It never supplies demo statistics.

The tracker deduplicates subscriptions by game ID, including the open editor. It refreshes once every 60 seconds while visible, skips hidden-page polling, refreshes on becoming visible and aborts obsolete requests. Server requests are also deduplicated; summary caching is 30 seconds for live games, 5 minutes for upcoming/other states and 15 minutes for final games. Explicit stale-cache flags are respected; a live receipt over three minutes old is unavailable. Provider receipt time remains visible. Actual downstream provider latency cannot be independently measured and an unofficial feed has no availability guarantee.

## Changed implementation files

- `src/domain/tracker.ts`: contracts, versioned schema, category calculations, correction-aware result states and feature limits.
- `src/data/tracker-storage.ts`: replaceable local repository adapter.
- `src/data/espn/server.ts`, `ecosystem-server.ts`: shared summary caching and verified roster access.
- `src/app/api/tracker/route.ts`: normalized game/participants/box-score endpoint.
- `src/components/tracker/tracker.tsx`, `use-tracker-games.ts`, `src/app/tracker/page.tsx`, `tracker.css`: compact tracker UI, collections, editor and refresh lifecycle.
- `src/components/ui/bottom-navigation.tsx`: first-class Tracker destination in the unused navigation slot.
- `src/components/explore/player-headshot.tsx`, `explorer.tsx`, `game-box.tsx`, `next.config.mjs`, `.env.example`: enabled optimised ID-matched portraits, accurate provenance text and silhouette fallback.
- `src/app/layout.tsx`: scoped tracker stylesheet only; original design tokens and screens are not replaced.
- `tests/tracker.test.ts`, `tests/e2e/tracker.spec.ts`: calculation, persistence, correction, lifecycle, UI and accessibility checks. Existing ecosystem/reconstruction expectations updated for the intentional enabled-headshot and navigation changes.

## Verification and actual screenshots

Typecheck, lint, 31 unit tests and production build pass. All 33 browser flows pass, including the 28 existing regression flows and five tracker flows. Tracker checks cover creation/edit/delete/archive/restore, collection membership/removal, reload, limits, corrupt storage, all four widths, axe accessibility, participant search, failed portraits, shared-game refresh, automatic polling, upcoming, DNP, postponement, at-most final settlement, stale and failed feeds. Unit tests cover all ten statistics, invalid/missing components, at-least corrections and both operator outcomes.

Actual running production app screenshots were captured and inspected at 360, 390, 768 and 1440 px with no horizontal overflow or page errors. Screenshots use provider data, not the browser-test mocks. The sample saved targets are for the completed 5 June New York schedule / 6 June London game, not a fabricated live fixture.

- [Tracker mobile](screenshots/tracker-390.png), [desktop](screenshots/tracker-1440.png), [360px](screenshots/tracker-360.png), [768px](screenshots/tracker-768.png)
- [Target editor and player search](screenshots/tracker-editor-390.png)
- [Roster headshots](screenshots/headshots-roster-390.png), [player profile](screenshots/headshots-profile-390.png)
- [Preserved dashboard](screenshots/tracker-dashboard-preserved-390.png), [game preview](screenshots/tracker-game-preserved-390.png)

After allowing the existing entry animation to complete, the dashboard's top 390×650 content crop has **zero changed pixels** against Phase 2. The game overview body is unchanged; its older Stage C comparison differs only in 398 pixels within the Overview tab label (hover/text rendering). The bottom navigation intentionally differs because Tracker is now available. Actual provider checks also confirmed:

- Game `401859964`: 30 published player rows; tracker box-score payload exactly equals the existing game-centre payload.
- Wembanyama: PTS 29, REB 9, AST 2, 3PM 2; computed PRA 40, matching the same box score.
- Upcoming game `401909088`: 35 verified-roster candidates, all provisional, with no invented player statistics.
- [Provider audit](tracker-provider-audit.json), [browser audit](tracker-browser-audit.json).

Run from `C:\Users\User\Documents\real`:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Open http://127.0.0.1:3000/tracker. The production preview may already be running on port 3000; stop it before starting a separate dev process.
