# Stage D — Favourites and More / Settings

Reconstructed the approved ninth and tenth screens within the existing `/favourites` and `/preferences` routes. No deployment, new API or unrelated feature added.

## Result

- Favourites opens on Teams: centred compact title, three category controls, charcoal team rows, existing logos or abbreviation fallback, NBA labels and immediate unfollow controls.
- Games preserves the followed-team schedule with native date input, status filters, game previews, independent follow controls, loading, error and empty states. It reuses the approved FixtureCard component.
- Players is explicitly disabled. No fake persistent player/game favourites were introduced.
- More uses seven compact icon rows matching the reference's grouping. Preferences exposes motion and reset; Data source switches existing demo/ESPN modes; Theme applies the existing turquoise/ice accents. Help and About contain useful local information. NBA is the only supported league and Notifications is explicitly unavailable.
- Source disclosure, search, safe-area bottom navigation and existing persistence remain available. Receipt timestamps sit below the Favourites list; stale warnings remain prominent above it.
- ESPN team identities are saved in a validated, bounded local directory when followed. Their names/logos survive an empty schedule and reload without a new provider request. Existing favourites IDs and demo/ESPN namespaces are unchanged. Reset clears the directory with the favourites.

## Visual process

Source crops (excluding hardware/OS):
- `docs/reference/stage-d-favourites.png`
- `docs/reference/stage-d-more.png`

Actual screenshots:
- `docs/screenshots/stage-d-favourites-espn-390.png` — actual existing ESPN integration, six followed teams from the 5 April 2026 slate
- `docs/screenshots/stage-d-favourites-390.png` — deterministic fictional demo
- `docs/screenshots/stage-d-more-390.png`
- `docs/screenshots/stage-d-theme-390.png`
- `docs/screenshots/stage-d-games-390.png`
- Favourites and More also captured at 360, 768 and 1440px.

Comparisons:
- `docs/screenshots/stage-d-favourites-comparison.png`
- `docs/screenshots/stage-d-more-comparison.png`

After the first screenshot pass, corrected inherited footer wrapping and moved routine ESPN receipt metadata below the list. Inspected final mobile/desktop, expanded theme and actual NBA-logo captures. No capture-run page errors or horizontal overflow at any tested width.

Remaining intentional differences: visible source disclosure and retained search affordance; actual followed teams rather than the screenshot's sample selection; unsupported Notifications/Players visibly disabled; settings expand inline to preserve existing routes and controls. NBA uses existing library iconography. No pixel-perfect claim.

The dashboard's final 390 × 744 demo capture was compared against Stage A using Pillow ImageChops: no changed pixels.

## Verification

- Production build, typecheck, lint: passed.
- Unit tests: 15 passed.
- Browser flows: 16 passed, including axe checks.
- New coverage: Teams/Games navigation, date/status filtering, unfollow persistence, keyboard-operated settings, theme/motion/reset persistence and ESPN identities across an empty schedule/reload.
- Existing schedule/search/favourites/provider/game-centre flows retained. Existing tests now open the appropriate category/settings row before testing the same functionality.

Run: `powershell -ExecutionPolicy Bypass -File .\run.ps1 dev`

Stage E community demonstration remains pending visual approval.
