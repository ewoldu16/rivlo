# Application experience, motion and interaction overhaul

19 October 2026. Implemented in the existing Next.js project. NBA services, stable IDs, tracker calculations/storage, existing routes, preferences, favourites, demo mode and source disclosures remain in place. No new packages or services were introduced.

## Reference discovered and initial audit

The installed **UI/UX Pro Max** skill was available at `C:/Users/User/.agents/skills/ui-ux-pro-max/SKILL.md`. Its instructions, quick reference, professional rules and local UX search results were inspected. The targeted search `dialog focus return reduced motion` returned verified guidance for reduced motion, avoiding excessive motion and focus appearance. The available design-system and ui-styling skills were also identified in the installed skill catalogue. Project configuration, package dependencies, current CSS tokens, previous design reports and actual browser screens were inspected.

It is not possible to establish that UI/UX Pro Max is the exact earlier reference the user remembers introducing. It is an accessible, relevant installed reference actually used here. Its interaction principles were applied to PROJECT 01; its palette/font/style catalogue was not copied. Existing historical design documents describe older iterations, so the current approved charcoal/cyan tokens and the new user brief took precedence.

The pre-edit browser audit found:

1. Headshots were decorative images inside profile anchors. Clicking a portrait necessarily navigated away.
2. Tracker saves/removals often changed content with no visible acknowledgement or undo. Target details could not be expanded.
3. Timing was scattered across page-specific CSS and Motion props. Focus and loading treatment differed across sections.
4. The 1440px interface retained a narrow centred mobile layout, and mobile bottom navigation was also used on desktop.
5. Real-game hydration could briefly render the demo-mode not-found state before selecting its provider. Tracker loading content could change card heights substantially.

Before captures: [desktop scores](screenshots/experience-before-scores-1440.png), [mobile tracker](screenshots/experience-before-tracker-390.png).

## Shared interaction foundation

- `src/components/experience/motion.ts`: shared press 100ms, hover 150ms, tab/filter 180ms, menu 200ms, dialog 240ms and page 200ms tokens with one easing curve. CSS timing variables are derived from these values.
- `provider.tsx`: persistent app-level photo viewer, action feedback and route-loading feedback. Navigation uses the existing Next routing; it does not intercept history, implement custom scroll restoration or delay navigation for an exit animation.
- `dialog.ts`: shared keyboard wrapping for native modal dialogs, used by the photo viewer and existing search dialog. Native modality makes background content inert; visible close controls, Escape, outside-close and focus restoration remain available.
- `primitives.tsx`: shared content-panel and skeleton presentation. Skeletons are static placeholders, without endless shimmer or fabricated data.
- `src/app/experience.css`: shared hover/press/focus/selected/disabled treatment, modal/toast styling, responsive layouts and reduced-motion alternatives. Animations primarily change opacity and transforms; target progress uses scaleX rather than animating layout width.

The former decorative page-entry line was removed. Route feedback appears only while an internal navigation is pending. Page content has a short fade, while tabs/filters retain their native routing or state changes. Existing search uses the shared dialog keyboard policy and timing tokens. Native select menus keep platform behaviour.

## Player portraits

`PlayerHeadshot` is now a dedicated button with an accessible Enlarge label and a visible expand affordance. Profiles, roster/leader rows, real box scores, tracker cards and tracker participant selection share the interaction. Player names remain separate links. Buttons are no longer nested inside profile links or radio labels.

The viewer uses the exact existing ID-matched portrait URL, enlarging from the trigger rectangle using a 240ms transform/opacity animation. The already loaded thumbnail remains visible while the larger optimized image loads; a failed full-size request keeps that existing portrait. The player's name and contextual team are shown. A close button, outside tap/click and Escape all work. Background scrolling is locked with temporary scrollbar compensation and focus returns to the originating button.

System reduced motion and the stored application motion preference remove expansion movement. Missing/failed/unmatched headshots retain the inert silhouette fallback. No alternate athlete, guessed URL or fabricated image is used. Commercial rights and photo season remain unverified, as documented in the previous headshot phase. The viewer is an enlarged portrait dialog, not a gesture-based gallery or custom pinch/pan tool.

## Tracker improvements

Targets now have motion-aware cards, expandable truthful details, animated verified-value/progress changes, clear reached styling and visible save/archive feedback. A live-to-reached transition produces a restrained contextual notice; initial completed results do not trigger a celebration. Existing at-most/final, DNP, stale/missing data and official-correction logic is unchanged.

Deleting a target provides Undo and restores focus to Add Target. Removing a collection keeps its targets and provides a scoped Undo. Undo preserves later changes instead of replacing the entire store with an old snapshot. Actionable notices remain available until dismissed or replaced; ordinary success notices dismiss after 4.5 seconds. Collection switching fades the content panel. Save errors remain explicit and do not claim success.

Statistic and progress slots keep their space while a feed response arrives. The tracker no longer inserts and removes a full skeleton inside each saved card. Initial hydration defers collection controls until storage is read, avoiding a large displaced section.

## Desktop and mobile

At widths below 1024px the five-destination bottom navigation and compact mobile presentation remain. At 1024px and above, the same navigation becomes a 200px persistent desktop rail with NBA explorer links and current-location styling. Main content uses a wider constrained workspace.

Scores use three columns at desktop and four at larger widths. Rosters use two or three columns; target cards use two or three columns. Tables and source information keep readable typography and spacing. At 390px the original two-column scores layout is retained. Touch controls, portrait triggers and tracker actions have appropriately sized targets. No SaaS summary tiles, unrelated charts, decorative gradients or new product features were added.

## Verification

Typecheck, lint, the production build and all 31 unit tests pass. All 37 Playwright flows pass, retaining the 33 existing flows and adding four interaction-focused flows. Browser verification covers:

- Desktop mouse opening and closing of portraits without accidental profile navigation.
- Mobile touch, outside-close, visible close control, Escape, focus restoration, keyboard wrapping and background scroll lock.
- Photo-dialog accessibility, system reduced motion, rapid tabs, back/forward navigation and responsive navigation at 390, 768, 1024, 1440 and 1920px.
- Tracker detail expansion, editing, deletion/undo and truthful final outcomes, plus existing tracker polling, persistence, limits and error states.
- Existing search, follows, onboarding, game centres, API contracts, loading/retry and source disclosures.

Tests can run against an isolated production preview using `PLAYWRIGHT_BASE_URL`; existing hardcoded root-URL expectations were made base-URL independent. Test data remains recorded provider fixtures. Screenshot capture uses actual running provider responses, not those mocks.

Production review is running at http://127.0.0.1:3100. The existing development server on port 3000 was left available. Run the usual local command from the project directory:

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

## Screenshots and limits

Actual screenshots and measured browser evidence are recorded in `experience-browser-audit.json`. This is interaction and layout sampling, not a controlled before/after performance benchmark or a guarantee for every device/network. The app adds no continuous animation loops, per-frame React updates or new provider polling. Data fetching and caching behaviour are unchanged.

Representative screenshots:

- [Desktop scores](screenshots/experience-scores-1440.png), [1920px scores](screenshots/experience-scores-1920.png), [mobile scores](screenshots/experience-scores-390.png)
- [Mobile photo viewer](screenshots/experience-viewer-390.png), [desktop viewer](screenshots/experience-viewer-1440.png)
- [Desktop roster](screenshots/experience-roster-1440.png), [player profile](screenshots/experience-profile-390.png)
- [Desktop tracker](screenshots/experience-tracker-1440.png), [mobile tracker](screenshots/experience-tracker-390.png), [undo](screenshots/experience-undo-390.png), [expanded details](screenshots/experience-details-390.png)

No deployment, new dependencies, provider integration, payments or authentication was added. Commercial image licensing remains an unresolved release requirement. Native browser/OS select and calendar menus retain their platform-specific appearance. Browser tests include emulated mobile touch, not physical-device testing.

## Final measured browser review

The fixed production build was retested: **all 37 browser tests passed**. Actual provider screenshots were then refreshed and inspected at all five requested widths. Across 25 page/width samples there were no page errors or horizontal overflows. Observed CLS ranged from 0 to 0.0533; real-game samples were 0, and tracker samples were 0 to 0.0001. This sampling includes initial hydration/data arrival and is not a controlled benchmark. The photo audit recorded the actual 240ms transform/opacity expansion, a loaded full-size portrait and locked body scrolling at both 390 and 1440px. Stored application reduced motion was tested in addition to the system preference.

Additional components updated consistently include the community composer (shared keyboard policy), community reaction feedback, settings-panel entrances and feed-search entrances. Tracker participant names retain their native radio-label selection behaviour while portrait buttons remain independent. Real-game mode is initialized from the stable route ID, preventing the previous transient demo not-found/header state.

Changed component groups: `src/components/experience/*`; `src/components/explore/{player-headshot,shared,explorer,game-box}.tsx`; `src/components/tracker/{tracker,target-card}.tsx`; `src/components/ui/bottom-navigation.tsx`; `src/components/community/feed.tsx`; `src/components/app.tsx`; root layout and `experience.css`. Data-service and statistical-calculation files were not replaced. Tests add `tests/e2e/experience.spec.ts`, improve participant selection assertions and allow an isolated base URL in `playwright.config.ts`.
