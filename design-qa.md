# Stage A screenshot reconstruction QA

final result: passed

Scope: dashboard only. Stage B and screens 1–4/6–10 are explicitly pending user approval.

## Source and matching viewport

Source visual truth: docs/reference/approved-ten-screens.png, the exact image attached to this task (1536x1024). Isolated dashboard app region: (1258,50)-(1494,500), 236x450px, saved as stage-a-dashboard-crop.png. Normalized comparison crop: docs/reference/stage-a-dashboard-390.png, 390x744. Hardware, Dynamic Island and OS status are excluded from the app implementation. Source corner masking and raster softness are not recreated.

Implementation: docs/screenshots/stage-a-dashboard-390.png, 390x744 CSS/pixels, DPR1. Actual ESPN historical April 5 schedule. Demo comparison state: stage-a-demo-390.png at the same dimensions, October 17 fictional scenario. Other rendered widths: stage-a-dashboard-360.png, -768.png and -1440.png. Source CSS viewport and original DPR are unknown; normalization is based on the app-content crop. No pixel-perfect claim.

Combined comparison: docs/screenshots/stage-a-comparison.png. Focused controls/card comparison: stage-a-detail.png. Both were opened and visually inspected after final capture.

## Iteration findings and fixes

- [P2 resolved] First card started at y=256 while the normalized reference starts around y=270. Adjusted filter/section rhythm; final measured y=270 at both phone widths.
- [P2 resolved] Initial date/filter text and heights were slightly underscaled. Date tiles now 60px high and chips 42px; section spacing adjusted to keep first-card alignment. Header and selected-date treatment follow the crop.
- [P2 resolved] Long real records were close to total text. Moved record anchors toward card edges and retained their smaller supporting scale; no invented short records substituted.
- [P1 resolved] Explicit link label omitted visible abbreviations, causing accessible-name mismatch. Replaced override with a full-matchup title while retaining the natural visible/accessible link content. Axe now passes.
- [P2 resolved] Tablet cards were stretched too wide. Tablet now has three compact columns; desktop four in a constrained 820px layout. Phone remains two columns by default.

## Required fidelity surfaces

Typography: Inter retained, with compact 12–13px supporting labels, 20px Games heading, 20–21px tabular card scores and no huge scoreboard. Reference's generated/rasterized glyphs are not exactly reproducible, especially condensed numbers. No clipping observed.

Spacing/layout: minimalist NBA header, calendar/search, four dates, filled filter chips, Games with grid/list icons and Standings, compact two-column fixture grid and fixed five-position bottom bar. At 390px cards are 178x140; at 360px 165x137. Nav is 66px. No featured game or admin sidebar. Dashboard CSS is scoped so later-stage routes keep their current design.

Colours/tokens: dashboard uses #0C1011, #101416, #1A1F21, #22282A, #2A3437, #F5F7F7, #A2ADB0, #788589 and #00DCE8. Cyan only identifies selection, navigation and followed states. No bright per-game border or decorative gradient.

Assets/icons: existing real remote ESPN logos preserve aspect ratio; fictional fallback abbreviations remain in demo. Existing icon library used for near-matching navigation/calendar/grid symbols. No hardware, OS chrome, copied screenshot surfaces or generated placeholder logos inserted into the app.

Content: actual fixtures, records and scores differ from illustrative reference values. Disclosure remains visible as a small header line absent from the mockup. Home/Favourites/More connect working existing routes; Cards/Feed explicitly disabled. Standings has an honest availability dialog. These scope/data differences are intentional and documented, not hidden functional claims.

## Verification

Build, TypeScript typecheck, lint and 15 unit tests pass. Ten browser flows pass, with all previous flows retained and one new geometry/interaction flow. Broad search selectors were narrowed by accessible name to distinguish the new calendar input; assertions and flows remain.

Axe checks pass in the existing demo/ESPN flows. Favourite persistence and click separation, search/focus/Escape, date/status, mode isolation, score update/reset, game reload, image fallback, loading/error/retry/stale and malformed/racing data remain covered. Calendar supports direct date selection. Grid/list toggle works. Disabled destinations and standings dialog tested. No page errors or global overflow in final unmocked captures. Measurements saved to docs/stage-a-measurements.json.

Remaining limits: source is a low-resolution composite; exact icon glyphs/rasterization and a few horizontal gutters differ. No physical phone/Safari/screen-reader check or FPS claim. Actual data/source notices and unavailable later-stage destinations prevent identical content rendering. No deployment. User visual approval is required before proceeding.

## Stage B completed
Shared palette, Inter typography foundation and route-aware five-position navigation now cover all existing screens. Dashboard comparison against Stage A has no changed pixels at 390 × 744. Mobile/desktop screenshots inspected; no capture-run page errors. Build, lint, typecheck, 15 unit tests and 11 browser flows pass. Details: docs/stage-b-report.md. Later screen reconstruction remains outside this stage.

## Stage C completed
Compact game centre reconstructed with Overview, quarter-filtered Play-by-play and two-team Stats. Unsupported Lineups stays disabled. Explicitly fictional details are isolated to demo game-1-0; ESPN never receives them and retains cached-source warnings. Reference crops and side-by-side comparisons saved. First-pass legacy table styling corrected after screenshot review. Screens captured at 360/390/768/1440px with no overflow or page errors. Build/typecheck/lint, 15 unit tests and 13 browser flows including axe pass. Details and remaining visual differences: docs/stage-c-report.md.

## Stage D completed
Favourites and More reconstructed in existing routes, with compact team rows/category controls and expandable settings rows. Games retains schedule filtering; existing preferences/data-source persistence remains working. Unsupported Players and Notifications are disabled. Validated local ESPN team metadata preserves saved identities across empty schedule dates. Captured 360/390/768/1440 layouts, inspected actual ESPN logos and demo screenshots, refined footer/source metadata placement, and saved source comparisons. No horizontal overflow or capture errors. Dashboard comparison against Stage A: no changed pixels at 390 × 744. Build/typecheck/lint, 15 unit tests and all 16 browser flows pass. See docs/stage-d-report.md for evidence and remaining visual differences.

## Stage E completed
Local community demo implemented at /feed with compact reference-based header, tabs, composer, avatars and post separators. Fictional profiles/counts explicitly disclosed; local-only search/reactions/text posting reset on refresh. No provider/publishing requests; unsupported actions disabled. Refined spacing after screenshot comparison to fit five mobile posts. Captured and inspected 360/390/768/1440 views and composer; corrected accessible control names. Build/typecheck/lint, 15 unit tests and 19 browser flows including axe pass. Dashboard above navigation remains pixel-identical; Feed is now enabled. Evidence and intentional differences: docs/stage-e-report.md.

## Stage F completed
Optional /onboarding reconstructs splash, leagues, searchable favourite teams and functional accent selection. Entry is More → Preferences → Personalise your app; home/returning users are not redirected. Drafts commit only on Get started, preserve motion/other preferences and use existing isolated favourite namespaces; Skip does not commit. Actual ESPN capture loaded 30 teams through the existing API. All eight hues work across app routes, with legacy Ice retained. Corrected inherited footer padding after first screenshot review; recaptured 360/390/768/1440 layouts and saved four source comparisons. No overflow/page errors. Build/typecheck/lint, 17 unit tests and all 23 browser flows including setup axe scans pass. All six stages are implemented; Stage F awaits visual review. Details: docs/stage-f-report.md.

## Phase 2 completed
Added all-30-team directory/pages, season/competition-aware conference standings, verified rosters, schedules, team stats/leaders, player profiles/game logs and real game-centre box-score links in the existing design. Live audit: 30 verified rosters, 539 unique player IDs, 30 schedules, six dynamic divisions; 2026–27 regular season unranked at 0–0. Fixed requested-season header handling and sourced division membership by stable IDs. 532 candidate headshot URLs have no verified season/rights provenance: silhouettes default, configurable image component and opt-in evaluation mode documented. No fake photos, rosters, rankings or current-season statistics. Actual mobile/desktop captures inspected, no overflow/page errors; default dashboard image unchanged. Build/typecheck/lint, 24 unit tests and 28 browser flows pass. Detailed inventory, endpoints, limitations and URLs: docs/phase2-report.md.

## Player Headshots + My Tracker MVP — 19 October 2026

Preserved the approved scores/game-centre design; activated the unused Cards primary-navigation slot as Tracker. Added scoped compact target cards, editor, player search with ID-matched portraits, named collections and local persistence. Inspected actual production screenshots at 360/390/768/1440 px. No horizontal overflow or page errors. After settling existing Motion entry opacity, the top 390×650 dashboard content crop matches Phase 2 exactly (0 changed pixels). Game overview content/body remains unchanged; older Stage C comparison differs only within the Overview tab text. Navigation intentionally changes to expose Tracker.

Actual tracker and existing game-centre box-score payloads match. Final game 401859964 supplies 30 player rows; Wembanyama's source 29 PTS + 9 REB + 2 AST gives PRA 40. Upcoming game 401909088 supplies 35 roster candidates, explicitly provisional. Headshot optimisation returned HTTP 200; missing/failed/incorrect-ID URLs fall back to silhouettes. Image season and commercial rights remain unverified.

Validation: typecheck, lint, production build, 31 unit tests and all 33 Playwright flows passed. Full details and screenshots: `docs/headshots-tracker-report.md`.

## Application experience, motion and interactions — 19 October 2026

Used the installed UI/UX Pro Max reference after reading its instructions and targeted local UX guidance. Added shared motion tokens, native-modal keyboard handling, image enlargement with origin animation, skeleton/content primitives, route feedback and action notices. Names and portraits now have separate actions. Tracker cards include details, scale-based progress updates and scoped removal undo. Desktop rail and multi-column layouts start at 1024px; compact mobile navigation remains. Existing routes, providers, tracker calculations, local storage and feature controls remain.

All checks pass: typecheck, lint, production build, 31 unit tests and 37 browser flows. Actual provider screenshots inspected at 390/768/1024/1440/1920px with no overflow or page errors. Sampled CLS 0–0.0533; game 0; tracker ≤0.0001. Viewer audit recorded loaded full-size portraits, 240ms origin animation, scroll lock and focus restoration. Mobile touch is emulated; no physical-device or controlled performance benchmark is claimed. Full evidence: `docs/experience-overhaul-report.md`, `docs/experience-browser-audit.json`, `docs/screenshots/experience-*`.
