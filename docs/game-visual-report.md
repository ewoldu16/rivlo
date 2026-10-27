# Rivlo game page visual refinement ? 21 October 2026

The game page now uses a consistent charcoal-and-gold card system. All ESPN endpoints, normalization, cache behavior, request scheduling, failure recovery and live polling are unchanged.

## Design changes

- Bordered central scoreboard card with a restrained warm highlight, prominent scores/team identities, compact status badge, venue/date metadata and a quiet source footer. Team/profile/favourite actions remain independent.
- Consistent 14px desktop / 12px mobile card radii, neutral borders, shared spacing and a stronger typography hierarchy. The game page uses muted gold highlights; global navigation continues to respect saved accent preferences.
- Main feed becomes a compact timeline: aligned clock/period, team logo, event category, player links, provider description and running score. Scoring plays use gold; fouls use muted rose; turnovers use muted blue. Both text labels and markers identify categories, so meaning does not rely on colour alone. Repeated category headings were removed when no player name is available.
- Desktop uses a wide feed plus a 340?360px contextual column. Mobile/tablet use a single column. Context cards show quarter scoring and three recent scoring plays from the **existing received game/feed snapshot**, with a direct action into the existing player statistics view. They issue no new requests and create no polling subscriptions.
- Team-comparison panels and the player statistics view receive matching bordered surfaces. Player statistics have an explicit heading, clearer table rows and constrained mobile identities.
- Existing score-change animation, tab motion and portrait interactions remain; restrained row/button hover feedback respects reduced-motion preferences.

## Data integrity and scope

Quarter values and totals come directly from the existing normalized game. Missing periods remain dashes, never invented zeros. Recent scoring uses provider descriptions containing ?makes?; it does not infer player totals, reconstruct a box score or rank players. Event-category matching is visual presentation only. Original descriptions, IDs, order, filters, corrections and updates remain intact.

The existing Stats view continues to display its provider box-score snapshot using the established workflow. No invented comparison statistics or extra filler content was added. NBA Home, navigation, fixture switching, rosters, favourites, My Tracker and the shared portrait viewer retain their implementations.

Runtime files changed:

- `src/app/game-visual.css` ? game-scoped visual tokens, cards, typography, timeline and responsive layout.
- `src/app/layout.tsx` ? imports the new stylesheet after the existing game styles.
- `src/components/game/game-context.tsx` ? snapshot-only contextual cards and box-score action.
- `src/components/game/live-plays.tsx` ? feed heading, event labels/classes and compact presentation.
- `src/components/game/game-centre.tsx` ? feed/context composition and explicit statistics heading.

Verification: TypeScript, ESLint, production build and all **57 unit tests** passed. Final production browser suite: **all 69 passed (2.7 minutes)**. The additional visual browser flow checks card placement across 390, 768, 1024, 1440 and 1920px, correct quarter totals, no overflow, contextual-card accessibility and navigation to the existing box score. Existing tests cover polling, failures/recovery, corrections, filters, accessibility and unrelated features.

## Screenshots

Captured from the running production application using the actual in-progress Philadelphia 76ers at New York Knicks game, ESPN ID 401909089. The displayed scores/events reflect the provider snapshots at capture time, not fixture data.

- `docs/screenshots/game-visual-desktop-1440.png` ? scoreboard, timeline and desktop context cards.
- `docs/screenshots/game-visual-mobile-390.png` ? mobile scoreboard and single-column feed.
- `docs/screenshots/game-visual-timeline-1440.png` ? detailed desktop timeline/context view.
- `docs/screenshots/game-visual-timeline-390.png` ? detailed mobile event rows.
- `docs/screenshots/game-visual-stats-390.png` ? mobile statistics container.
- `docs/screenshots/game-visual-before-1440.png` ? before refinement, from the previous Boston?Detroit game view; different game/status, for layout comparison only.

Capture script: `.tools/game-visual-capture.mjs`.

Review: http://127.0.0.1:3001/games/espn-401909089?section=feed
