# Rivlo Scores — Apple Sports reference milestone

Scope: Scores homepage and its required shared presentation components only. Game pages, Tracker, pop-ups and ESPN data logic retain their existing implementation.

## Visual comparison

The supplied reference uses a compact masthead, Yesterday / Today / Upcoming navigation, a black canvas and tightly stacked charcoal matchups. Logos sit at the outer edges, large scores sit beside them and NBA / status occupies the centre. A final game's lower score is muted. Team names sit beneath the score line.

Rivlo now follows that hierarchy. It retains original branding, existing verified ESPN logos, local Inter typography, source disclosure, status filters, team following, search, calendar, navigation and user-selected accent themes. The default accent is restrained gold. The reference's Apple artwork, device status bar, green background tint and betting interface are not copied.

The first render was compared with the supplied screenshot and revised: the first mobile matchup moved from y=275 to approximately y=178, and rows became 90px rather than 106px. The prior interface's first matchup began around y=344. The final list shows approximately six complete rows at 390 × 844, plus part of the next row; fixed navigation remains clear. Rivlo's source disclosure, status filters and following controls deliberately add some density compared with the reference.

The desktop adaptation uses a centred, bounded schedule with two columns and a functioning single-column list preference. Personal content follows the games instead of competing in a sidebar. No new requests or polling loop are introduced. Saved Tracker target counts reuse the existing storage subscription.

## Captures

- [Before / after mobile comparison](before-after-mobile.png)
- [Before mobile](before-mobile.png), [after mobile](after-mobile.png)
- [Before desktop](before-desktop.png), [after desktop](after-desktop.png)
- [Initial mobile implementation before refinement](iteration-1-mobile.png)
- [Actual ESPN schedule on mobile](espn-mobile.png)
- [Expanded visual comparison and desktop review](comparison.html)

Before/after captures use the same explicitly fictional demo schedule, enabling a consistent structural comparison. The ESPN capture uses the application's real schedule endpoint for 20 October 2026, including completed, in-progress and upcoming games. Team logos were allowed to finish loading before accepting that capture. The automated live-update test replays a recorded ESPN summary and changes its score and clock through the existing polling contract; it is an integration test, not a new latency benchmark.

## Verification and remaining boundaries

Final verification: all 63 unit tests and 83 browser tests passed. ESLint, TypeScript typecheck and the production build also passed. No regression remains in the exercised suite. Coverage includes mobile and desktop widths, overflow, automated accessibility scans, date keyboard navigation and history, touch interactions, search, following, reduced motion, source failures and stale data, plus automatic live score/clock changes. Existing game details, play-by-play, Tracker, rosters and unrelated features remain covered by the full browser suite.

Game pages and My Tracker have not been restyled. The initial Scores milestone stops here pending the user's visual approval. The live source remains an unofficial ESPN integration and can supply delayed or incomplete data; the redesign preserves its existing disclosures and recovery behavior.
