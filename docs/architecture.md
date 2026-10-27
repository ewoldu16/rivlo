# Architecture

Existing Next.js App Router routes remain `/`, `/favourites`, `/preferences`, `/games/[id]`. `/api/nba` is the same-origin server read boundary for unofficial ESPN evaluation. UI consumes normalized NBA snapshots, never raw ESPN responses.

- `src/domain/nba.ts`: NBA model, state labels, independent totals/periods, selectors, validated preference and snapshot contracts.
- `src/data/contracts.ts`: existing NbaReadRepository and deterministic mock repository.
- `src/data/espn/mapping.ts`: provider response schemas, ID/team/logo/status/quarter normalization. Pure functions with recorded-contract tests.
- `src/data/espn/server.ts`: server-only provider fetch, 8-second timeout, bounded coalescing cache, stale recovery and repository implementation.
- `src/app/api/nba/route.ts`: validated calendar-date/event-ID input, normalized JSON output and explicit errors.
- `src/components/app.tsx`: existing responsive UI, local mode selection, same-origin snapshot reads, abort/identity protection during date changes, search and independent local follows.

Fictional demo remains the default. Existing demo preferences/sample event and known IDs are preserved. Mode and real-team follows use separate versioned keys. Direct ESPN routes identify their mode through stable `espn-EVENT_ID`; provider IDs are also retained separately. Real team IDs are `espn-team-ID`. Guest storage failures preserve current-visit use.

Inter variable font is bundled locally from rsms/inter with OFL licence under public/fonts; no runtime font fetch. Team logo images remain remote ESPN URLs, displayed unoptimized with fixed dimensions and strict CDN/path normalization. No logos are bundled or server-optimized.
