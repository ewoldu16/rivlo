# Phase 2.1 — NBA game-centre navigation and header

20 October 2026. Implemented in the existing Next.js application. Scope is the fixture selector, matchup header, tab navigation and necessary shared-shell wiring. Phase 2.2 content was not built.

## Experience

- Neighbouring fixtures come from the existing `/api/nba?date=` schedule service, using the selected game's authoritative New York schedule date. Direct game links first load the existing summary service. The selected game remains available if a neighbouring schedule is empty or fails; schedule failures offer retry. Fictional demo fixtures stay explicitly labelled.
- Native horizontal scrolling supports touch and trackpads. Previous/next controls support mouse users. Arrow keys, Home and End move focus between fixture links; Enter follows the stable game URL. Pointer movement suppresses accidental selection after a swipe. Selection is centred sensibly and marked by an animated cyan underline and `aria-current`.
- Away team appears on the left, home on the right. Scores use that same identity order. Actual logos, names, supplied records and independent follow controls remain accessible. Logo and name share a team-profile link for real team IDs; fictional demo identities do not acquire counterfeit profile links.
- Upcoming games show local tip-off and local date, with no invented 0–0 result. The fixture strip adds a local day when it differs from the New York schedule day. Live games show verified totals, quarter/clock where supplied, or halftime/overtime state. Final games show supplied totals and identify a winner only when both totals are known and unequal. Provider final descriptions, including Final/OT, are preserved. Delayed, suspended, postponed, cancelled and missing-data states remain explicit.
- Primary tabs are Feed, Game, away abbreviation and home abbreviation. Feed uses the existing play-by-play content, Game retains Overview and Stats, and team tabs select the corresponding existing statistics view. The existing secondary view buttons remain, including the honestly disabled Lineups control. No new community feed, roster or comparison content was created.
- Tabs use accessible tab semantics, roving focus with arrow/Home/End keys, stable header/selector placement and URL-backed section/detail state. Back, forward and reload restore the selected section. Switching to another fixture opens its Game overview; returning through browser history restores the earlier game's section.
- A new game request replaces old details with a shared skeleton, preventing a new selection from appearing over old statistics. Refreshing the same game retains its coherent header/content while the existing refresh request completes. Requests remain abortable; no new polling loop or upstream API was added.
- Desktop reuses the home phase's existing horizontal primary navigation. Mobile retains the established bottom navigation. The game workspace has a comfortable maximum width, wider team presentation and bounded tab widths.

## Reuse and files

Used the installed [UI/UX Pro Max skill](C:/Users/User/.agents/skills/ui-ux-pro-max/SKILL.md), its verified keyboard-navigation guidance and the previously supplied REAL references for continuity and hierarchy. PROJECT 01's typography, charcoal/cyan tokens and original styling remain. No REAL branding or proprietary assets were copied.

New components:

- `src/components/game/game-navigation.tsx`: fixture selector, logo fallback, local-time formatting, matchup header and primary tab controls.
- `src/components/game/game-experience.tsx`: existing schedule-service integration, persistent navigation shell, loading/error recovery and refresh wiring.
- `src/app/game-navigation.css`: scoped responsive header/navigation styling and shared-token interaction states.

Modified application files:

- `src/components/game/game-centre.tsx`: composes the new chrome and maps primary tabs to preserved content; URL/history section restoration.
- `src/components/app.tsx`: mounts the persistent game experience, retains same-game snapshots during refresh and reuses the home navigation layout.
- `src/components/explore/game-box.tsx`: optional team selection for primary team tabs; existing player links, portrait interactions and box-score structure remain.
- `src/app/home.css`: shares the existing home navigation selectors with the game screen.
- `src/app/layout.tsx`: imports scoped game navigation styles.
- `src/data/espn/mapping.ts`: preserves supplied final-status detail rather than dropping overtime descriptions.

Reused Motion, `motionTiming`, reduced-motion preferences, `LoadingSkeleton`, `ui-content-panel`, score feedback, search dialog/focus management, favourites, navigation feedback and all existing routes. No dependencies were added. The existing overview, fictional events, verified box scores, player routes, portrait dialog and tracker implementation were retained.

Tests: new `tests/e2e/game-navigation.spec.ts`; final-status unit coverage in `tests/espn.test.ts`; existing assertions in `app.spec.ts` and `espn.spec.ts` updated for the explicit away/home header order and the new venue location.

## Verification

TypeScript typecheck, ESLint, production build, all 33 unit tests and all 48 browser tests pass. The complete production browser suite finished in 1.5 minutes.

Seven new browser flows verify home entry; neighbouring fixture links and URLs; history; local dates in an America/Los_Angeles browser; real team logo/name routes; primary-tab keyboard/history/reload behaviour; preserved demo events/statistics; request gating that prevents stale game content; same-game refresh; schedule error/retry; one/empty schedules; delayed/suspended/postponed/cancelled/unknown states; missing totals; all five widths; reduced motion; arrow controls and emulated touch scrolling. Existing regression tests cover the remaining application, including player links, accessible photo viewing, favourites, search and tracker journeys.

Actual production screenshots were captured with the existing ESPN service, not intercepted browser-test data: 20 October's upcoming schedule has three games; 5 April's final schedule has eleven. The live screenshots use the clearly disclosed fictional demo. Screenshots were inspected at 390, 768, 1024, 1440 and 1920px. No horizontal page overflow or browser page errors were observed. Actual-provider axe scans at 390 and 1440px reported zero violations for upcoming and final screens. [Recorded browser audit](game-phase21-browser-audit.json).

## Screenshots

| State | Mobile | Desktop |
|---|---|---|
| Upcoming, actual provider | [390px](screenshots/game-phase21-upcoming-390.png) | [1440px](screenshots/game-phase21-upcoming-1440.png) |
| Final, actual provider | [390px](screenshots/game-phase21-final-390.png) | [1440px](screenshots/game-phase21-final-1440.png) |
| Live, fictional demo | [390px](screenshots/game-phase21-demo-live-390.png) | [1440px](screenshots/game-phase21-demo-live-1440.png) |

Additional upcoming screenshots: [768px](screenshots/game-phase21-upcoming-768.png), [1024px](screenshots/game-phase21-upcoming-1024.png), [1920px](screenshots/game-phase21-upcoming-1920.png). Corresponding final screenshots are saved with the same width suffixes. Before: [mobile](screenshots/game-phase21-before-390.png), [desktop](screenshots/game-phase21-before-1440.png).

## Constraints

- ESPN remains an unofficial development preview with possible delays, omissions, corrections and outages. Existing attribution/licensing constraints remain. Broadcast names do not guarantee local availability. Missing records, scores and clocks are not synthesized.
- Feed remains the existing play-by-play capability: illustrative events for the supported fictional game and an honest unavailable state for this provider. Team tabs use existing statistics, not new roster/comparison designs. Lineups remain unavailable.
- The new header/selector use browser-local time. Existing overview content keeps its explicitly London-labelled timestamps, as that content was outside this phase's redesign scope.
- Fixture selection uses snapshots from the selected schedule day; unrelated dates are not invented to fill an empty strip. Refresh uses existing infrastructure, not a new live feed or polling system.
- Browser verification used Chromium with emulated mobile touch. Physical-device testing, every browser engine and a controlled performance benchmark are not claimed. Actual live-provider play was not observed; live interactions were verified with the labelled demo and recorded response tests.

## Run and review

From `C:\Users\User\Documents\real`:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Production preview: [upcoming game](http://127.0.0.1:3200/games/espn-401909088), [final game](http://127.0.0.1:3200/games/espn-401810987).
