# Architecture Notes

## How did you isolate failure between APIs?
- Independent API modules maintain separate concerns: `lib/api/github.ts` and `lib/api/fakeStore.ts`.
- Centralized network helper `lib/api/utils.ts` wraps `fetch` with timeout and typed `ApiError` for consistent error handling (`lib/api/utils.ts:12`, `lib/api/utils.ts:27–43`).
- UI isolation via `DataSection` passes `error` and `isLoading` independently per dataset, so one failing source does not block others (`components/explorer/DataSection.tsx:60–74`).
- Interactive lists (`ProductList`, `RepoList`) use `useDataFetcher` per dataset, which manages error/loading per fetcher instance (`hooks/useDataFetcher.ts:21–41`).
- E2E tests mock each API independently through local Next.js routes (`app/api/mock/**`) and environment overrides, enabling deterministic failure simulations without cross-impact.

## Why did you choose server vs client fetching for each dataset?
- Detail pages (`app/product/[id]/page.tsx`, `app/repo/[owner]/[name]/page.tsx`) fetch on the server to:
  - Populate `generateMetadata` for SEO and robust canonical titles (`app/product/[id]/page.tsx:15–23`, `app/repo/[owner]/[name]/page.tsx:22–30`).
  - Render consistent SSR content and handle errors early.
- Aggregated explorer (`components/explorer/UnifiedExplorer.tsx`) fetches on the client to:
  - Support live search with debounce (`components/explorer/UnifiedExplorer.tsx:11–13`, `components/explorer/useDebounce.ts`) and per-dataset toggles.
  - Avoid coupling interactive UI state to SSR boundaries.

## What technical debt did you knowingly accept?
- No caching layer; all requests are direct fetches. Revalidation windows are minimal (`revalidate` in pages), but results still depend on external rate limits.
- Basic pagination for Product/Repo lists; no virtualization for large datasets (`components/explorer/ProductList.tsx:48–52`, `components/explorer/RepoList.tsx:41–45`).
- Error presentation is local to `DataSection` without a global error boundary.
- E2E mocks live inside the app (`app/api/mock/**`), mixing production code with test-only endpoints.
- Image hosts include `example.com` to satisfy test fixtures (`next.config.ts:21–26`), not ideal for production safety.
- ESLint config warning in `next.config.ts` remains to keep build-lint behavior consistent across CI.

## How would you onboard a new engineer to this codebase?
- Tour structure:
  - App routes and pages in `app/**`; explorer entry `app/page.tsx` renders `UnifiedExplorer`.
  - API clients in `lib/api/**` and shared types in `types/index.ts`.
  - UI primitives in `components/ui/**`; explorer features in `components/explorer/**`.
- Runbook:
  - `npm install`
  - `npm run dev` to start the app
  - `npm test` for unit tests and `npm run e2e:test` for Playwright tests
- Key components:
  - `UnifiedExplorer` glues search input, debounced query, and dataset toggles.
  - `useDataFetcher` standardizes async data lifecycle.
  - `DataSection` ensures consistent loading/error/enable UX.
- Testing:
  - Unit coverage for hooks, pages, lists.
  - E2E coverage for explorer and detail flows with deterministic mocks and failure cases.

## Why did you choose this data-fetching approach?
- Reusable `fetchJson` with `AbortController` timeout prevents hung requests and surfaces failure uniformly (`lib/api/utils.ts:12–19`, `lib/api/utils.ts:27–43`).
- Server data for detail pages aligns with Next App Router best practices for SEO and predictable SSR.
- Client data for explorer enables immediate user feedback for toggles, searches, and pagination without page reloads.
- Environment-based base URLs let us swap between real APIs and local mocks cleanly (`lib/api/github.ts:4–5`, `lib/api/fakeStore.ts:4–5`).

## What are the biggest scalability risks?
- External API rate limiting and search caps (GitHub caps search pagination at 1000 results, handled by page cap in `RepoList` at `components/explorer/RepoList.tsx:41–45`).
- Lack of caching or background refresh; repeated queries hit upstream services directly.
- Large list rendering without virtualization could cause performance issues under heavy data.
- Image fetching from many remote hosts may slow render; current config allows multiple hosts.
- No backoff/retry strategy beyond displaying errors; transient failures may degrade UX.

## What trade-offs did you intentionally make?
- Simplicity over infrastructure: no dedicated server-side aggregation or cache to keep code approachable.
- Client-side interactivity for explorer favored responsiveness over SSR consistency.
- Local Next.js API mocks for E2E to avoid test flakiness and CI dependencies on third-party services.
- Minimal state management: kept to React state and small custom hooks to reduce complexity.
- Limited metrics and logging to avoid noise; errors surface in UI but not persisted centrally.

