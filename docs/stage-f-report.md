# Stage F — Optional onboarding

Implemented the four remaining reference screens in the existing Next.js application at `/onboarding`. Entry is available from More → Preferences → Personalise your app. Existing users and the home route are never automatically redirected into setup.

## Behaviour

- Minimal splash reuses PROJECT 01's existing CircleDot brand symbol in turquoise. A deliberate primary action starts setup; no forced timer or continuous animation.
- League selection reproduces the compact three-column grid. NBA is the only operational league; all other sports are visibly unavailable.
- Team selection has search, provider logos/fallback icons, team names and accessible selection indicators. It starts from the existing favourites and current data mode.
- Demo mode uses clearly labelled fictional teams. ESPN mode reuses `/api/nba` and the established provider/repository/cache boundary. The actual running integration returned all 30 team identities for the screenshot capture. Loading, cached identity fallback, unavailable/empty states and retry are supported without substituting demo identities into ESPN mode.
- Team/colour choices are drafts until Get started. Back preserves drafts; Skip exits without committing them. Completion uses the existing demo/ESPN favourite namespaces and preserves other preferences, including motion. Selected ESPN team identities are stored in the bounded validated directory.
- All eight reference hue choices apply genuine shared accents across existing routes and persist. Existing Arctic ice preferences remain compatible and are available in More; setup also exposes Ice when it was the existing choice. Preference storage remains version 1 and backward compatible.
- Setup uses three meaningful progress steps after the splash, native accessible controls and focus transfer to each screen heading. Reduced motion and safe-area spacing are honoured.

## Visual verification

Reference crops:
- `docs/reference/stage-f-splash.png`
- `docs/reference/stage-f-leagues.png`
- `docs/reference/stage-f-teams.png`
- `docs/reference/stage-f-theme.png`

Actual running screenshots:
- `docs/screenshots/stage-f-overview.png` — four-screen montage
- `docs/screenshots/stage-f-splash-390.png`
- `docs/screenshots/stage-f-leagues-390.png`
- `docs/screenshots/stage-f-teams-espn-390.png`
- `docs/screenshots/stage-f-theme-390.png`
- All four screens also captured at 360, 768 and 1440px; demo team capture available at each width.

Source/application comparisons are saved as `docs/screenshots/stage-f-{splash,leagues,teams,theme}-comparison.png`.

First-pass screenshots revealed inherited normal-app bottom padding raising the footer by 100px. The dedicated setup shell now owns its viewport/footer spacing. Refined team rows and colour-grid placement, recaptured all widths, and inspected final mobile/desktop results. No horizontal overflow or capture-run page errors.

Intentional differences: original PROJECT 01 branding rather than the reference P symbol; library sports icons rather than unsupported league assets; disabled sports and explicit source notices; three functional progress steps rather than six decorative dots; colour values adjusted for readable accents on dark surfaces. No phone hardware/OS chrome is implemented. No pixel-perfect claim.

## Validation

- Production build, TypeScript and ESLint passed.
- 17 unit tests passed, including new accent storage compatibility/round-trip checks.
- All 23 browser flows passed. New onboarding flows cover draft/commit behaviour, Skip/Back, search, existing preference compatibility, actual dashboard colour rendering, demo/ESPN favourite isolation, provider failure/retry, reduced motion and axe scans for every screen at 360/390/768/1440px.
- Existing scores, dates, filters, search, game centres, favourites, settings, community and provider tests remain passing.

Run locally:
`powershell -ExecutionPolicy Bypass -File .\run.ps1 dev`

All six implementation stages are now implemented and verified. No deployment performed. Stage F is ready for visual review.
