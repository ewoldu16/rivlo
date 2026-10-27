# PROJECT 01 design system

Consumer NBA product: a continuous score feed with one leading simulated in-progress matchup, top desktop navigation and bottom mobile navigation. No permanent sidebar, summary rail or two-column card grid.

Palette: canvas #030607; secondary #090F11; surface #10191C; raised #172326; border #213438; turquoise #00E5D4; hover #4CF5E9; text #F7FAFA; secondary text #99ADB2; muted #70868B. Turquoise marks interactive/selected/followed states and simulated live status. Muted text is supplementary.

Typography uses system sans with Segoe UI Variable/Segoe UI on Windows. Important team names 14–20px, ordinary scores 28–31px, featured scores 58–80px, game scores 80–128px. Numerals are tabular. Labels use sentence case and restrained letter spacing.

The first live fixture has opposing identities and totals, plus a central quarter/clock. Other games form a cohesive divided list. Independent follow buttons are siblings of fixture links. All routes retain visible fictional-data disclosure. Game previews use a scoreboard stage and a separate scoring section, with unplayed quarters shown as dashes.

Desktop feed width is constrained to connect identities and numbers; phone layout retains full identities. Mobile navigation respects safe areas. Search uses a native modal, focus restoration, Escape support and a short exit animation. CSS and Motion respect system/app reduced motion. No continuous animations or additional features.

Existing preference IDs remain compatible: mint now means turquoise; ice is the lighter cyan alternative. Team colours only identify fictional badges and add subtle atmosphere. Lucide icons are retained. No external images or proprietary marks are shipped in the product.

Current refinement: Inter is bundled locally through next/font/local (public/fonts/InterVariable.woff2; OFL.txt). Featured scores are 42–48px and regular scores 28px, with shorter featured geometry. ESPN preview badges use supplied remote logos with fixed dimensions, preserving aspect ratio and offering an abbreviation fallback. See docs/espn-phase-report.md for current evidence.

## Application interaction overhaul — 19 October 2026

The current interaction layer is `src/app/experience.css`, with timing tokens in `src/components/experience/motion.ts`. Preserve the existing charcoal/cyan identity. The latest brief explicitly introduces adaptive desktop layouts: from 1024px the primary navigation is a persistent rail, scores use three/four columns, and rosters/tracker use multiple columns. Mobile retains the five-destination bottom navigation and compact scores grid. This supersedes older single-feed/no-sidebar layout notes above.

Player photographs are independent accessible controls opening a shared native modal; player names remain profile links. Shared dialogs wrap keyboard focus, lock background scroll and restore focus. Buttons/cards/tabs use consistent hover/press/focus/selected states. Reduced-motion preferences disable expansion and content motion. Loading and action feedback use shared primitives, and tracker deletion has Undo. See `docs/experience-overhaul-report.md` and the actual browser evidence before making further changes.
