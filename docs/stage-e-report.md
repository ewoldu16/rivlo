# Stage E — Local community demonstration

Implemented `/feed` inside the existing Next.js application and enabled the shared Feed navigation destination. No deployment or community backend added.

## Implementation

- Compact NBA/search header, Following/Featured/Latest controls with active underline, compact text composer and posts separated by thin rules, following the approved eighth screen.
- Separate fictional community fixtures and selection helper in `src/domain/community.ts`, with reusable post rows and avatars in `src/components/community/feed.tsx`.
- Permanently visible disclosure: Local community demo — fictional profiles, posts and counts. Sample ages are illustrative, not a live clock. Following is a seeded demo subset, independent of saved NBA team favourites.
- Working local filters, case-insensitive profile/text search, reversible reactions and text composer. Text remains plain React-rendered content. Blank posts are rejected, input is limited to 280 characters and dialog closing restores focus.
- Demo posts/reactions are memory-only and reset on refresh or leaving the view. Nothing is published or persisted as an account.
- Image uploads, emoji picker and comments are explicitly unavailable. Post-details controls explain the fictional content. No fabricated verification badges, real user profiles or live engagement.
- Community does not request the NBA provider, even if ESPN mode is selected. Existing sports data, preferences and favourite namespaces remain unchanged.

## Visual evidence and refinement

Reference crop excludes phone hardware and OS chrome:
`docs/reference/stage-e-community.png`

Actual running Chromium captures:
- `docs/screenshots/stage-e-feed-360.png`
- `docs/screenshots/stage-e-feed-390.png`
- `docs/screenshots/stage-e-feed-768.png`
- `docs/screenshots/stage-e-feed-1440.png`
- `docs/screenshots/stage-e-composer-390.png`

Source/application comparison:
`docs/screenshots/stage-e-comparison.png`

The first pass was too tall to comfortably expose five posts. Reduced row spacing and shortened illustrative copy, then recaptured and inspected mobile/desktop. Five sample profiles now fit at both phone widths. Corrected accessibility labels to include visible control text/counts; the composer uses a library user icon rather than hidden visible initials.

Remaining differences are intentional: the visible demo disclosure adds vertical space, fictional initials replace unsupported real profile imagery, unsupported actions are disabled, and existing library iconography/shared bottom navigation remain. No pixel-perfect claim.

Dashboard image comparison against Stage D found only the newly enabled Feed icon/label changed: bounding region (259, 694)–(282, 731) at 390 × 744. All content above navigation is pixel-identical.

## Verification

- Production build, typecheck and lint passed.
- All 15 unit tests passed.
- All 19 browser flows passed, including axe scans of the feed and composer.
- New flows cover filters, search, local reactions, local text posting, plain-text rendering, blank validation, focus restoration, refresh reset, disabled actions, navigation, reduced motion and 360/390/768/1440 layouts.
- Request assertions confirm no provider calls or POST/PUT/PATCH/DELETE publishing requests from local community interactions.
- Actual capture run: no horizontal overflow or page errors.

Run: `powershell -ExecutionPolicy Bypass -File .\run.ps1 dev`

Review `/feed`. Stage F onboarding remains pending visual approval.
