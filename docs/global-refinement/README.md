# Rivlo global UI refinement

This pass preserves the existing components, navigation, information and data architecture. It refines spacing, surfaces and responsive alignment; it does not introduce a new design or begin another phase.

## What changed

- One shared wrapper contract now governs Scores, Game Centre, Favourites, Feed, Tracker and Explorer: 1200px maximum outer width, 16px mobile gutters and 24px tablet/desktop gutters. Existing sidebar navigation remains intact.
- Game Centre's panel wrapper is transparent and fills the same bounds as the scoreboard and My Targets. The feed uses flexible 65/35 columns from 1024px, with a 16px gap, matching card headers and a vertical stack below that breakpoint. Supporting cards size to their content.
- Team-colour mixes were reduced from 28.9%/25.5% to 10.5%/9%. Charcoal is now the dominant surface, with a softer downward fade, fine borders and no ambient outer glow. Scores keeps consistent card dimensions and two columns on desktop, as requested in this brief.
- The scoreboard retains team logos, records, venue, date and status while using smaller logos, a calmer tip-off time and tighter internal spacing.
- Empty My Targets uses a compact, neutral two-line layout and shorter guidance. The Tracker link retains its 44px target. Populated targets keep their statistics, status, collections and editing interactions.
- Roster rows use smaller headshots and padding, subtle dividers and consistent statistical columns. Filters wrap cleanly and retain 44px controls, season selection and all sorting options. Favourite and tracking actions retain their 44px targets.
- Default interactive states now use the same restrained turquoise across pages; explicit saved accent themes remain functional. Gold remains for selected scores/statistics. Metadata and event labels have a clearer hierarchy, with fewer all-caps labels.

Shared values live in `src/design/scores-tokens.json`. The generated surface stylesheet and focused `src/app/refinements.css` reuse those values. Backend/API logic, contracts, polling and persistence were not changed.

## Measurements

These compare the same recorded game and empty-target state, measured in Chromium CSS pixels.

| Viewport | Scoreboard before | After | Height reduction | Empty Targets before / after |
| --- | ---: | ---: | ---: | ---: |
| 390px | 282.3px | 231.3px | 18.1% | 75.7px / 66.0px |
| 430px | 282.3px | 231.3px | 18.1% | 75.7px / 66.0px |
| 768px | 305.9px | 261.9px | 14.4% | 75.7px / 66.0px |
| 1024px | 232.9px | 196.3px | 15.7% | 75.7px / 66.0px |
| 1440px | 232.9px | 196.3px | 15.7% | 75.7px / 66.0px |

No overall page overflow was found at 390, 430, 650, 700, 759, 760, 768, 1023, 1024 or 1440px. The regression test also checks exact shared boundaries, the desktop column ratio, matching adjacent header heights, stacked mobile cards and the Tracker link's touch target.

## Before-and-after screenshots

| View | Mobile: before / after | Desktop: before / after |
| --- | --- | --- |
| Scores homepage | [Before](before-scores-390.png) / [After](after-scores-390.png) | [Before](before-scores-1440.png) / [After](after-scores-1440.png) |
| Game Centre matchup header | [Before](before-matchup-390.png) / [After](after-matchup-390.png) | [Before](before-matchup-1440.png) / [After](after-matchup-1440.png) |
| Play-by-play and supporting cards | [Before](before-timeline-390.png) / [After](after-timeline-390.png) | [Before](before-timeline-1440.png) / [After](after-timeline-1440.png) |
| Team roster | [Before](before-roster-rows-390.png) / [After](after-roster-rows-390.png) | [Before](before-roster-rows-1440.png) / [After](after-roster-rows-1440.png) |
| My Targets empty state | [Before](before-targets-empty-390.png) / [After](after-targets-empty-390.png) | [Before](before-targets-empty-1440.png) / [After](after-targets-empty-1440.png) |

Full-page viewport captures of Game Centre and the roster are also saved as `before/after-feed-{width}.png` and `before/after-roster-{width}.png`. Raw measurements are in [before-metrics.json](before-metrics.json) and [after-metrics.json](after-metrics.json).

Screenshot data: Scores uses its existing, explicitly labelled demo mode. Game Centre and roster captures replay existing recorded ESPN fixtures in an isolated browser; production data sources are unchanged. Roster averages and injury reports absent from those fixture responses are shown as unavailable, rather than invented. The roster schedule fixture's incompatible optional record objects are omitted by the screenshot harness; no application parser was altered. Captures establish UI behaviour, not current live NBA results or provider latency.

## Verification

- 63 unit tests passed.
- 87 browser regression tests passed.
- ESLint, TypeScript checks and production build passed.
- Android Chromium, iOS WebKit and desktop WebKit menu smoke checks passed without overflow or page errors.
- WebKit Scores, Game Centre and roster checks passed at 390, 768, 1024 and 1440px, without overall page overflow.

Existing browser coverage verifies accessibility, reduced motion, safe-area clearance, search, season selection, comparisons, rosters, favourites, modal focus/scroll restoration, live score and play corrections, polling failures, cross-tab Tracker synchronisation and request reuse. The existing grid expectations were updated specifically for the requested two-column desktop layout; behavioural assertions remain in place.

Preview: http://127.0.0.1:3001/

The pass stops here for review. No subsequent phase has been started.
