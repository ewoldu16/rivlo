# Premium UI refinement and ESPN local-preview report

## Delivered in the existing project

Inter variable font loaded locally through next/font/local with its OFL licence. Existing black/turquoise navigation retained. Featured totals standardized to 42–48px with shorter geometry; regular totals to 28px; names, labels, date controls and navigation now share the same font/weight system. Snapshot notice compacted after screenshot review. Team identity uses remotely displayed ESPN logos when available, with fixed-size abbreviation fallback.

Fictional demo remains the default and all original routes/data/controls remain. Preferences now offers Fictional demo / ESPN preview, with local mode persistence and separately stored ESPN-team follows. No demo sample updates apply in ESPN mode. Existing demo favourites, preference version, fixtures and sample event are retained.

Added server-only ESPN adapter, raw-response validation/mapping, bounded cache, normalized same-origin read API, explicit failure/stale states, date loading/abort protection, date calendar, manual refresh and directly reloadable real game previews. No unrelated accounts, community, subscriptions, paid services or deployment.

## Actual endpoint and browser evidence

The three candidate ESPN endpoint families were fetched and inspected. The server successfully returned real schedules and summary data through /api/nba. April 5, 2026 returned 11 games; June 5 returned one final; October 18 returned zero fixtures. The UI shows an honest empty state for that last date.

An unmocked Chromium session loaded schedules and remote logos, confirmed Inter via computed font-family, followed the actual June game route, read its scores/quarter totals/venue, and captured screens at 360/390/768/1440. No page errors or global horizontal overflow. docs/espn-live-verification.json records the normalized API smoke evidence. Browser tests use recorded/minimized contracts separately; screenshots named espn-* come from actual server/provider requests, not test interception.

## Verification

- Production build: pass.
- Explicit TypeScript typecheck: pass.
- Lint: pass, no warnings.
- Unit tests: 15 pass (six existing and nine added).
- Browser tests: nine pass (four existing and five added).
- Axe scans: pass for existing flows and ESPN preview test state.
- Responsive screenshot review: all requested widths inspected, plus game and preferences.

Coverage includes totals independent of quarters; home/away; schedule date near midnight; summary's different linescore fields; missing scores/quarters; overtime/halftime/unknown/postponed/cancelled; safe logo URL handling/failure fallback; duplicate/bad fixture handling; invalid JSON/HTTP/shape failures; in-flight coalescing and cached/stale behaviour; isolated follows; mode persistence; real-game reload/search; empty/error/retry; malformed normalized responses and date races.

The scan caught a source-link accessible-name mismatch and that was fixed while preserving its visible label. First browser inspection caught excessive snapshot-notice height and featured-clock wrapping; both were refined and recaptured. The image capture script initially waited on hidden lazy search-result images; it was corrected to verify rendered logos, rather than changing product image behaviour to satisfy the script.

## Screenshots

- docs/screenshots/espn-full-slate-1440.png — full desktop schedule.
- docs/screenshots/espn-full-slate-390.png — phone schedule.
- docs/screenshots/espn-full-slate-360.png and espn-full-slate-768.png — additional responsive views.
- docs/screenshots/espn-game-desktop.png and espn-game-mobile.png — actual game preview.
- docs/screenshots/espn-preferences.png — mode selection.
- docs/screenshots/espn-empty-schedule.png — real empty schedule.
- docs/screenshots/espn-design-comparison.png — reference comparison.

## Date and reliability rules

ESPN selector dates are New York NBA schedule dates; tip-offs display London time. Example: June 5 schedule game starts June 6 at 01:30 London. The provider query is dates=YYYYMMDD. Demo preserves its original London-date convention.

Upstream requests have an 8-second timeout. Cache TTLs are 30 seconds for in-progress, 5 minutes scheduled/mixed/empty, 15 minutes all-final, 24 hours teams. Cache is bounded/process-local, with coalescing and explicitly labelled stale fallback for up to 24 hours after a failed refresh. No polling or real-time guarantee. No cold-error fallback to fictional scores. See docs/data-provider-boundary.md.

## Remaining limits

Unofficial endpoints have no established availability/coverage contract. This is a local evaluation integration, not a commercial redistribution authorization. Logos remain direct CDN images; none are downloaded or bundled. Public data/logo rights remain unresolved. No actual live game was observed during verification; state mappings were exercised with controlled contracts. No physical mobile/Safari/screen-reader or measured latency/FPS review. Automated scans do not prove full accessibility conformance.

The supplied brief ended mid-sentence in error handling; the listed failure cases and missing-data paths were covered without expanding scope. No next-phase functionality was added.

## Run

```powershell
powershell -ExecutionPolicy Bypass -File .\run.ps1 dev
```

Open http://127.0.0.1:3000. Preferences → Data source switches modes. A populated local preview URL is `/?mode=espn&date=2026-04-05`.
