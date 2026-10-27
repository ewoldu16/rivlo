# Unofficial ESPN local preview boundary

This phase adds local visual/development evaluation through ESPN's publicly accessible, unofficial NBA endpoints. No public hosting, signup, provider agreement, paid trial, commercial licence or guaranteed live service was established. Public redistribution and NBA/ESPN image rights remain unresolved.

## Verified endpoints

Inspected real JSON on 18 October 2026:

- `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260605`
- `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20260405`
- `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=20261018`
- `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams`
- `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/summary?event=401859964`

The June schedule returned one completed game; April 5 returned eleven; October 18 was empty. These are observed responses, not assumed coverage guarantees. Summary competitors use displayValue-only quarter records, unlike scoreboard numeric value/period records; mappings handle both. Only consumed schedule, identity, score, status, quarter and venue fields enter application snapshots.

## Date rule

ESPN dates use compact `YYYYMMDD` query values. The app's ESPN selector explicitly represents the NBA schedule date in America/New_York. A game starting 2026-06-06T00:30Z belongs to June 5 in New York. Tip-off times and received timestamps display Europe/London, including its DST. Fictional demo preserves the original London-calendar grouping. Modes do not silently mix these conventions.

## Normalization

Home/away is determined by competitor homeAway, never array order. IDs retain a provider mapping. Totals are supplied scores, independent of period arrays; no total is invented from partial quarters. Missing points/quarters are null/unavailable, not zero. Period arrays preserve missing slots and overtime. Scheduled, in-progress/halftime/overtime, final, postponed, cancelled and unknown/delayed states are explicit. Missing clocks remain empty. Source occurrence timestamps remain null; fetchedAt/observedAt record receipt, not event time.

Team responses and scoreboard/summary identities are validated. Only HTTPS a.espncdn.com /i/teamlogos/nba/ URLs are accepted. next.config.mjs restricts the same path. Images use next/image unoptimized (direct browser CDN request), fixed dimensions, object-fit contain, descriptive alt text and abbreviation fallback on failure. No team/logo image files are downloaded or bundled. Do not treat this preview implementation as production rights clearance.

## Request/caching policy

Fixed server-side ESPN base URL; no arbitrary upstream URL parameter. Event IDs are digits and dates are calendar-validated. Each fetch has an 8-second timeout. Invalid JSON/HTTP errors/unexpected envelopes fail visibly. Individual bad fixtures are omitted with warning; an entirely unreadable non-empty payload fails instead of pretending to be an empty schedule. Duplicate IDs collapse.

In-memory cache is bounded to 64 keys per Node process and coalesces concurrent requests. In-progress TTL 30 seconds, scheduled/mixed/empty 5 minutes, all-final 15 minutes, team directory 24 hours. No polling. Refresh is explicit and still respects cache TTL. Failed refreshes can use an existing snapshot for at most 24 hours with an explicit stale warning and original receipt timestamp. Cold failures never substitute fictional data. Cache is process-local and resets on restart; no shared production cache is claimed.

Client date requests are aborted on change and keyed to the current date/game. Loading/error states replace mismatched older results. A malformed same-origin contract has a friendly error and retry. No live timing or latency guarantee has been measured.

## Phase 2 extension
Team/roster/schedule/statistics, conference standings, division membership, athlete profiles/game logs and game box scores now pass through `src/data/espn/ecosystem-server.ts` and normalized ecosystem contracts. See `docs/phase2-report.md` for precise endpoint/season rules, headshot restrictions and live coverage. This extends the original boundary; it does not establish provider or media rights. The former core-only snapshot description above remains the historical record of the original ESPN phase.
