# Phase 1 — NBA home screen overhaul

19 October 2026. This phase changes the NBA home screen and its necessary shared-shell wiring. It does not redesign the game centre, player profiles, community or My Tracker.

## Reference and approach

Read the installed **UI/UX Pro Max** skill at `C:/Users/User/.agents/skills/ui-ux-pro-max/SKILL.md` and used its local UX search for sports fixtures, mobile density and date navigation. Verified results covered locale-aware date formatting, preserving browser history and avoiding content being obscured by fixed navigation. The previously supplied REAL screenshots informed information density, clear matchup hierarchy and compact navigation; no REAL assets or exact layout were copied.

Inspected the running home screen at mobile and desktop widths before editing, the existing App/data-provider boundary, current score components, shared navigation, motion tokens, skeletons, focus handling and action feedback. Existing historical documentation was read in context; the current approved charcoal/cyan palette and latest interaction system were retained.

Before: [mobile](screenshots/home-phase1-before-390.png), [desktop](screenshots/home-phase1-before-1440.png).

## What changed

- **Application header:** compact mobile wordmark, search, calendar and personalisation control. Desktop uses the existing primary navigation in a home-specific horizontal top-bar arrangement, with PROJECT 01 branding and existing Scores/Tracker/Favourites/Feed/More destinations. The rest of the application keeps its existing desktop rail and mobile bottom navigation.
- **League navigation:** NBA is explicitly selected in cyan. Teams opens the existing NBA directory. The strip supports overflow without exposing counterfeit working sports or empty placeholder destinations; NBA remains the only implemented league.
- **Date strip:** scrollable dates with weekdays, clear active selection, existing Motion layout indicators, previous/next day, native calendar and an obvious Today control. ESPN uses New York schedule dates. Demo Today explicitly means the fictional 17 October snapshot; unavailable demo dates are disabled. Arrow keys and Home/End select supported dates, restore focus and keep selection visible. Pointer movement during a swipe suppresses accidental day selection. Back/forward restores the date and filter.
- **Fixtures:** home-only compact team rows with aligned larger scores, real logos or abbreviation fallback, full names/cities, verified records where supplied, local tip-off time, actual status and supported clock. A local date is added when the tip-off falls on a different local calendar day from the NBA schedule date. Home/away score identity is unchanged. Upcoming and missing totals remain dashes. The existing status formatter handles missing quarters, halftime and overtime.
- **Broadcasts:** the existing provider mapping now optionally carries supplied `names` or summary `media.shortName` values. Missing or malformed broadcast metadata is omitted without inventing a network or discarding an otherwise valid game. Displaying a provider-supplied broadcaster does not promise availability in the user's region.
- **Fixture actions:** one underlying game link covers the card. Team links and follow controls are independent siblings, with explicit stacking/hit areas and useful accessible names even when logos fail. Hover and press feedback uses existing motion tokens. The source/demo disclosure remains visible.
- **Games hierarchy:** Games, result count, integrated Standings access and compact filters lead the schedule. Mobile uses full-width compact matchup rows; tablet uses two columns; desktop uses a wider workspace with two fixture columns plus a personal area, and wide desktop supports three fixture columns. List/grid controls remain available at tablet/desktop widths.
- **Personalisation:** Your NBA follows the games in DOM/mobile order and sits alongside on desktop. It reads existing non-archived tracker configurations and existing followed teams. It does not invent live tracker progress, standings or engagement. Empty states link to real existing features.
- **Loading and errors:** home skeletons resemble matchup geometry. Same-date background refresh keeps the verified fixtures while disabling refresh and marking the source as updating. A different date uses loading placeholders rather than showing a previous date's games. Failed requests retain explicit retry; no demo scores are substituted for provider failures. Existing race protection and server caching remain.

## Components and tokens

New home components:

- `src/components/scores/home-dashboard.tsx`: home hierarchy, date strip, filters, skeleton/empty/error states and read-only personal summary.
- `src/components/scores/home-fixture.tsx`: compact matchup presentation and independent controls.
- `src/app/home.css`: home-scoped responsive presentation and spacing tokens (`--home-gutter`, `--home-gap`, `--home-section`).

Existing components reused/refined:

- `src/components/scores/dashboard.tsx`: existing logo fallback, home fixture presentation option and home header; existing Favourites fixtures retain their old presentation.
- `src/components/app.tsx`: existing data/search/favourite/sample logic wired to HomeDashboard; same-date refresh preservation and date/filter history restoration.
- `src/components/ui/bottom-navigation.tsx`: optional home layout, retaining the same routes and navigation logic.
- `src/app/layout.tsx`: imports home-scoped CSS after the shared interaction styles.
- `src/domain/nba.ts`, `src/data/espn/mapping.ts`: optional validated broadcast metadata only.

No competing motion framework, new dependencies, authentication, live APIs, community system or payment flow was introduced. Existing `motionTiming`, shared easing/CSS variables, native dialog, skeleton, focus and navigation-feedback systems are reused. Existing preferences, local-storage namespaces, game routes and stable team/player identities remain.

Tests added/updated: `tests/e2e/home.spec.ts`; responsive home expectations in `reconstruction.spec.ts` and `experience.spec.ts`; broadcast normalization coverage in `tests/espn.test.ts`.

## Verification

Typecheck, ESLint, production build, all 32 unit tests and all 41 browser tests pass. Browser coverage includes the existing regression suite plus four dedicated home flows. The home checks exercise all five requested widths, accessibility, every demo fixture destination, independent team/favourite navigation, Standings/Tracker access, date keyboard/history controls, reduced motion, touch scrolling, local timezone conversion and refresh/loading/race behaviour. Existing tests continue covering all other sections, malformed data, stale sources, errors, preferences, setup, tracker and player-photo interactions.

Final production review found no browser errors or horizontal page overflow at 390, 768, 1024, 1440 and 1920px. Real-provider home accessibility scans at 390 and 1440px reported zero axe violations. Secondary content stays hidden during initial schedule loading to avoid moving visible content when the full schedule arrives. The recorded tablet layout-shift value fell from 0.157 to 0.00031 in this local review; these observations are not a controlled performance benchmark.

Screenshots are captured from the actual production app using real provider schedules, not the browser-test mocks. Historical 5 April 2026 demonstrates a populated genuine schedule; 20 October 2026 demonstrates upcoming games. Demo/live-looking screenshots are explicitly marked fictional. Test fixture manipulations occur only in tests.

## Screenshots

- [390px home](screenshots/home-phase1-scores-390.png)
- [768px home](screenshots/home-phase1-scores-768.png)
- [1024px home](screenshots/home-phase1-scores-1024.png)
- [1440px home](screenshots/home-phase1-scores-1440.png)
- [1920px home](screenshots/home-phase1-scores-1920.png)
- [Upcoming mobile](screenshots/home-phase1-upcoming-390.png), [upcoming desktop](screenshots/home-phase1-upcoming-1440.png)
- [Explicit fictional demo](screenshots/home-phase1-demo-live-390.png)
- [Unchanged game-centre review](screenshots/home-phase1-game-unchanged-390.png)

The actual browser audit is `docs/home-phase1-browser-audit.json`. Browser interactions are tested in Chromium; configured Playwright recordings retain the test interactions. Physical-device testing and a controlled performance benchmark are not claimed.

## Limits and next game-centre phase

- ESPN remains an unofficial, possibly delayed/unavailable development source. Existing attribution and commercial-use/licensing limitations remain. Missing records/broadcasts are omitted, not synthesized.
- NBA is the only implemented league. Other sports are hidden, so there is no simulated league switching.
- Tracker summary counts saved, non-archived configurations only. It does not poll games or claim verified live progress. Local storage remains device/browser-local.
- Default fictional demo is preserved. Today in demo mode is clearly labelled Demo today; real Today uses the NBA's New York calendar day.
- The calendar input retains native platform behaviour. Mobile touch was emulated in browser tests.

Recommendations for a separate game-centre phase: apply browser-local tip-off formatting consistently while retaining NBA schedule-day context; adapt the match header/quarter table to the wider desktop shell; preserve verified box scores, stable team/player links and the existing accessible portrait dialog. Reuse the same interaction tokens and data boundary. None of those game-centre changes is implemented in this phase.

## Run

Production review: http://127.0.0.1:3200/?mode=espn&date=2026-04-05

From `C:\Users\User\Documents\real`:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```
