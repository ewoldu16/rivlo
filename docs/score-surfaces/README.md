# Scores surface refinement

The approved layout, navigation, card dimensions, score typography and game behavior are unchanged. The page canvas remains near-black.

Game surfaces now use each team's own colour: left-team colour on the left, right-team colour on the right, an explicit mixed-colour centre stop, and a shared downward fade into near-black. The previous slate-softened washes were replaced so the team identity is clearly visible. Live cards have a warmer upper highlight, delicate accent edge and a faint static ambient halo. Upcoming cards have cooler slate depth. Completed cards use a quieter charcoal finish. Inset edges and highlights provide separation without changing the box model or card size. The existing default gold and custom accent preferences remain functional.

The surface definitions live in `src/design/scores-tokens.json` under the new `surface` token layer. The existing generator emits them in card scope so team colours and the selected accent resolve in the correct context. The component only supplies validated team-colour CSS variables; it does not contain gradient or shadow definitions. Invalid colour values fall back to the slate token.

No raster assets, backdrop filters, animated gradients, new timers or extra API requests were introduced. The existing score animation and hover feedback retain their reduced-motion behavior. Surfaces use static CSS paint layers. The same tokens and state classes apply across mobile, tablet and desktop.

## Before and after

| Viewport | Before | After |
| --- | --- | --- |
| 390px | [Mobile before](before-390.png) | [Mobile after](team-blend-390.png) |
| 1440px | [Desktop before](before-1440.png) | [Desktop after](team-blend-1440.png) |

Captures use the same explicitly fictional demo schedule in isolated browser contexts. Mobile card height remains 98px; desktop card height remains 116px. No real game statistics were created or modified for this work.

## Accessibility and checks

The initial live highlight made the old muted grey too dim over its brightest content backgrounds. A brighter card-local muted-text token and softened team washes correct that. Sampled interior content backgrounds, excluding borders and fixed-navigation occlusion, returned at least 4.72:1 contrast for muted text in the tested mobile/desktop scenarios, including an all-white team/accent stress case. These samples complement the existing automated accessibility checks; they are not a claim of comprehensive accessibility certification.

All 63 unit tests and 86 browser tests passed, along with lint, TypeScript typecheck and the production build. WebKit mobile/desktop and Android Chromium emulation also passed gradient-paint, overflow, following, search/close and console smoke checks. The existing responsive tests cover eight widths, card alignment, independent favourite controls, safe-area clearance, keyboard navigation, reduced motion, live-update layout stability and preserved features across the application.

Work stops at this Scores-only visual refinement for approval. Game pages and My Tracker have not been restyled.
