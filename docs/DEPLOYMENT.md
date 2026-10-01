# Deployment

## Vercel (recommended)

1. Push `netscape-surface` to GitHub (private repo — see DECISIONS.md D1;
   repo privacy is the director's call, never public without per-item approval).
2. In Vercel: **Add New → Project → Import** the repo.
3. Deploy. Zero config — no build overrides, no environment variables.

There is nothing to configure because v0.1 keeps no secrets (INV-09): the
NASA `DEMO_KEY` is a public constant, the GitHub API is called
unauthenticated, and state lives in the browser's localStorage.

## Local

```bash
npm install
npm run dev        # http://localhost:3000 — development
npm run build      # production build (also type-checks)
npm start          # serve the production build locally
npm test           # vitest suite
```

Node ≥ 20. No other services, no database, no env file.

## Public APIs used

| API | Use | Auth | Rate limit (observed, public docs) |
|---|---|---|---|
| `api.nasa.gov` (APOD) | Demo surface A | `DEMO_KEY` (public demo key) | ~30 requests/hour/IP |
| `api.github.com` (repos) | Demo surface B (`akadaan310/purl`) | none | 60 requests/hour/IP unauthenticated |

Limits are per client IP and easily reached during a demo session with
refreshes. This is expected, not a failure.

## Graceful degradation

When a public API is rate-limited or unreachable, the surface degrades to an
honest card — never to fabricated content, never to a retry storm:

- **429 / network failure on NASA:** the APOD surface renders a card stating
  the fetch failed, why (rate limit or network), and when to retry. The
  surface's identity and prior state are untouched.
- **429 / network failure on GitHub:** same treatment for the repo surface.
- **7u (SIMULATED):** unaffected — it never touches the network.
- **ACSP document (PROPOSAL):** static content, unaffected.
- **Observatory:** records the failure as an event (`surface.fetch_failed`,
  actor: system) with the status code. Failures are evidence, not errors to
  hide.

No request is retried automatically more than once, with backoff; the human
retries explicitly via the card's retry control, which is itself logged as an
event with actor `human` (INV-10).

## What is not deployed in v0.1

- No backend, no database, no session server — state is localStorage
  (DECISIONS.md D6).
- No ACSP server connection — checkpoint/handoff interop is PROPOSAL
  (DECISIONS.md D7).
- No live model endpoint — 7u is SIMULATED (DECISIONS.md D5).
- No secrets to rotate, no env vars to set, no credentials to provision.
