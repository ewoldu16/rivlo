# Phase 2.5 — Live Tracker integration

Game pages now show a compact My Targets section scoped to the exact ESPN game ID. Targets open the correct player sheet, and the Stats table displays a restrained gold target count beside tracked players. Archived and unrelated-game targets are excluded.

Player sheets support multiple targets, inline creation and editing, all ten existing statistic categories, both comparisons, existing collection membership and the current free-plan limit. Edits preserve target UUID, game, player and team identities. Saves reload the latest store before applying changes, validate the existing version-1 schema and preserve unrelated targets and collections. Removed targets or collections are checked again at save time. No derived statistics are written to storage.

A shared storage subscription publishes successful same-tab saves and listens for native cross-tab storage changes, including storage clear. The dedicated Tracker subscribes too. Corrupt storage remains untouched; failed writes do not emit a successful update.

Progress reuses the existing targetProgress calculation and the game page's existing ESPN box-score snapshot. There is no new Tracker endpoint request or polling loop on game pages. Live polling updates both the page cards and any open player sheet, including downward official corrections. Pending, Active, Reached and Final states include text, while missing statistics, DNP and stale snapshots remain unavailable. At-most targets settle only after final. Game snapshot failures now propagate the existing stale flag into the detail context.

The dedicated Tracker retains its existing once-per-game, 60-second polling; game pages retain their existing adaptive game polling. Definitions synchronize immediately through browser storage events; progress is calculated from the latest verified snapshot received by each view, so separate tabs can briefly differ between their existing polling intervals. Storage remains device/browser-local and is not an atomic cross-tab database; simultaneous writes retain localStorage's last-writer behavior.

Dark bordered surfaces, compact gold progress indicators, native labelled controls and the existing accessible dialog are reused. No new notification stream is introduced. New targets require a verified game box-score player; an unpublished pregame roster alone is insufficient in this inline editor. Existing pregame targets remain Pending.

Verification uses recorded, real ESPN summary and Core payloads replayed through the application's API contract, with controlled live polling, status changes and corrections. This is deterministic integration testing, not a new observation of a currently live NBA game. Screenshots use replayed provider statistics and explicitly seeded test targets, not user-created targets.

Validation: 63 unit tests across 11 files and all 82 browser tests passed, plus ESLint, TypeScript typecheck and production build. Six new browser tests cover inline creation/editing, multiple targets, persistence and collections, Stats indicators, automatic polling, downward corrections, stale/missing data, pending and final states, mobile overflow, corrupt storage, unrelated-game filtering and native two-way synchronization with a separate Tracker tab. Three new persistence tests cover schema validation, failed writes and subscription cleanup. Existing accessibility checks and the complete unrelated-feature suite also pass.

Screenshots: [Desktop target sheet](phase25-desktop.png), [Mobile target editor](phase25-mobile.png). These are fixture replay captures with test targets.
