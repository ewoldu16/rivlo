# Phase 2.5.1 — Cross-platform Scores refinement

Scope is limited to the Scores homepage and the shared presentation, favourites subscription and viewport configuration needed for it. ESPN endpoints, polling intervals, target calculations and persistence keys are unchanged. Game pages and My Tracker have not been redesigned.

## What changed

- Consolidated the previous appended homepage overrides into one generated Scores stylesheet. The portable source is `src/design/scores-tokens.json`, with primitive, semantic and component tokens for colours, typography, spacing, dividers, radii, touch targets and layout dimensions. Responsive thresholds are also defined there. `src/design/scores-home.css` holds the responsive presentation template; `npm run design:scores` generates `src/app/sports-home.css`. Production builds regenerate it automatically.
- Made mobile cards, scores, logos and metadata use consistent tracks, reserved dimensions and fixed row heights. At 320px, smaller logos and score typography preserve separation. Long names truncate within their team track while accessible link text retains the identity. An explicit LIVE label identifies live games; final scores retain a muted losing side. Upcoming fixtures display the scheduled start time, with no score elements or placeholder scores.
- Preserved independent 44px favourite controls, keyboard focus, reduced-motion behavior, search, date selection and the list/grid choice. Score changes animate within a reserved track. The live replay test now asserts that the card's bounding box remains identical after a score/clock update.
- Added `viewport-fit=cover`, safe-area-aware header and bottom navigation spacing, and enough bottom content clearance for the fixed navigation. Zoom remains enabled.
- On desktop, the brand, destinations and utility controls occupy one horizontal navigation row. The content heading becomes NBA scores rather than repeating Rivlo branding. Search, calendar and My NBA remain accessible and share their existing handlers.
- Rebalanced Your NBA with a clear Tracker summary and active-target count, plus compact team and player favourites. Player favourites reuse the existing validated storage subscription through a shared hook; they do not introduce another fetch. Compact automatic columns keep one or two favourites from becoming a stretched, empty row. All favourites remain available through the existing destination.

## Layout by available width

| Width | Navigation | Schedule | Card height |
| --- | --- | --- | --- |
| 320 / 375 / 390 / 430px | Fixed bottom bar, safe-area spacing, compact masthead | Single vertical list | 98px |
| 768px | Bottom navigation; full touch targets | Two columns; 354px cards at this width | 108px |
| 1024px | Horizontal top navigation and aligned utilities | Two columns | 116px |
| 1440 / 1920px | Horizontal top navigation | Three bounded columns, approximately 376px per card | 116px |

The two-column threshold is 760px: after gutters and gaps, each card has enough room for two team/score tracks, centre metadata and independent favourite controls. The desktop navigation threshold remains 1024px, where all five destinations plus brand and utilities fit without overlap. Content is bounded at 1200px. List view remains a single column at all widths.

## Screenshots and visual review

All five required widths were captured and opened for inspection. Extra narrow-phone captures are provided too. The captures use Rivlo's explicitly fictional demo schedule, one saved demo team, and a player favourite selected from an existing recorded ESPN fixture. They are isolated browser data, not changes to the user's saved favourites.

- [390px mobile](scores-390.png)
- [768px tablet](scores-768.png)
- [1024px small desktop](scores-1024.png)
- [1440px desktop](scores-1440.png)
- [1920px large desktop](scores-1920.png)
- [320px](scores-320.png), [375px](scores-375.png), [430px](scores-430.png)
- [Your NBA, mobile](your-nba-mobile.png), [Your NBA, desktop](your-nba-desktop.png)
- [WebKit mobile](webkit-mobile.png), [Android Chromium emulation](android-chromium.png), [WebKit desktop](webkit-desktop.png)

The 390px result was compared with the supplied Apple Sports reference: opposing edge logos, scores beside each logo, central game status, compact charcoal surfaces on black, and a three-part date selector are retained. Rivlo additionally keeps its source disclosure, status filters, explicit LIVE text, team following and five main destinations. No Apple artwork, device status bar or proprietary branding is copied. Upcoming times are now the visual centre of scheduled fixtures rather than blank scores.

Desktop was reviewed independently: the content uses a deliberate two/three-column progression, bounded cards, a single navigation/utility row and a balanced personal section. Tablet retains touch-oriented navigation without adopting the desktop header prematurely. Inspection found and corrected an encoding issue in generated token CSS and a stacking-context issue hiding desktop utilities behind navigation.

## Verification

Final validation: all 63 unit tests and 86 browser tests passed, along with ESLint, TypeScript typecheck and the production build. Three new responsive tests were added, the live-update test now checks layout stability, and two existing layout assertions were updated for the deliberate wide-screen three-column layout. Targeted checks cover all eight widths, absence of horizontal overflow, team/metadata track separation, 44px favourite controls, utility hit-testing, accessibility scans, scheduled-state truthfulness, simulated safe-area insets and footer clearance, keyboard search/close, and personalisation with a single player or team.

Additional browser-engine smoke checks passed in WebKit mobile, Android Chromium emulation and WebKit desktop: responsive overflow, independent favourite interactions, search/open/close and no page JavaScript errors. These are browser-engine/device-emulation checks, not tests on physical iOS/Android devices.

## Architecture and remaining limits

This remains a responsive Next.js website, not an installed native application. Existing pure domain contracts, ESPN normalization, Tracker progress calculations and backend endpoints can be reused by a future app. Design values and breakpoint definitions now have a single portable JSON source. A future native UI would still need a token transform, native components, platform-safe-area handling and platform storage adapters; DOM components and localStorage are not presented as native APIs. No framework migration or new paid service was introduced.

The ESPN source retains its existing delay/missing-data limitations and disclosures. Actual safe-area geometry and OS/browser chrome still require physical-device verification before native distribution. No remaining layout or functional regression is known from the exercised checks. Work stops at this refinement; game-page and Tracker redesigns require a subsequent approved scope.
