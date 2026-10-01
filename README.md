# Netscape — Infinite Surface

Netscape is the web embodiment of Golden Surface: a human-facing computational surface through which one human and several computational participants — websites, AI sessions, repositories, documents — inhabit the web together, in one dark, quiet room. It is a client, not a protocol and not a replacement for the systems it sits over: it opens surfaces (a live NASA image, a GitHub repository, a simulated AI participant, a research document), attaches participant context to them, and records every act with its author named. What is live is labeled live; what is simulated is labeled simulated; what is merely proposed is labeled proposed.

```
HUMAN
  └── GOLDEN SURFACE                      the room; the orchestration boundary
        ├── WEBSITE                       (NASA APOD, live)
        ├── AI                            (7u, SIMULATED adapter in v0.1)
        ├── ARTIFACT / DOCUMENT           (ACSP protocol document)
        ├── REPOSITORY                    (akadaan310/purl, live)
        ├── ...                           (CODE, RESEARCH, TERMINAL, RESOURCE,
        │                                  SESSION, CONFERENCE — defined, see docs/)
        └── SUBSTRATE                     purl / ACSP / substrateIO lineage
              ├── STATE                   what is open now
              ├── CONTINUITY              what carried over
              └── EVIDENCE                what happened, hash of who did what
```

## Quickstart

```bash
git clone <this-repo>
cd netscape-surface
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm test           # vitest
```

Vercel: connect the repo, deploy. Zero config; no environment variables.

## Demo walkthrough (v0.1)

Five demo surfaces, opened in order:

- **A — NASA.** The live Astronomy Picture of the Day, fetched from `api.nasa.gov` with the public `DEMO_KEY`. Real network call, real image. **[live]**
- **B — GitHub repo.** Live metadata for `akadaan310/purl` from public `api.github.com`. **[live]**
- **C — 7u.** A simulated AI participant, presented through an explicitly labeled simulated adapter. It responds from canned/scripted context, never as a live model. **[SIMULATED]**
- **D — ACSP document.** The ACSP/0.1 protocol invariants as a research document surface. Static content in v0.1; the checkpoint/handoff mapping to a live ACSP server is marked **[PROPOSAL]**, not implemented.
- **E — The surface itself.** A recursive surface: Netscape opens a card describing Netscape. Rendered as a labeled projection, not actual nesting — the card says what it is.

**The "Come here" primitive.** Open surface A (NASA). Its context is NASA's: the picture, the explanation, the date. Now invoke **Come here** on the 7u participant. After: the NASA surface is still the NASA surface — but 7u's context is attached to it as a labeled, separable layer. 7u has not become NASA; NASA has not become 7u. The observatory records one `context.attached` event with `actor: human`. Detach, and the surface returns to exactly what it was. That detachability is the whole point: *continuity without merger.*

## What is real vs simulated

| Item | Status | Label |
|---|---|---|
| NASA APOD fetch | live public API | AXIOM (observed in the network panel) |
| GitHub repo metadata | live public API | AXIOM |
| localStorage persistence | real, local | AXIOM |
| Surface events + observatory | real, client-side | ESTABLISHED |
| 7u participant | canned, simulated adapter | **SIMULATED** |
| ACSP checkpoint/handoff interop | not implemented | **PROPOSAL** |
| Surface-of-itself | labeled projection | OBSERVED-as-rendered |

No simulated adapter ever presents as live. If a demo key is rate-limited, the surface degrades to an honest card that says what it could not fetch — never to fabricated content.

## Docs

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — the system map: SEURL, PURL, ACSP, substrateIO, Golden Surface (Expo app), MUSA, the NetGov ACSP implementation, and where Netscape sits among them.
- [docs/NOMENCLATURE.md](docs/NOMENCLATURE.md) — the vocabulary: Surface, Participant, adapters, contexts, sessions, events, "Come here" — and the Participant vs purl-Principal distinction.
- [docs/CONSTITUTION.md](docs/CONSTITUTION.md) — the 10 invariants (INV-01…INV-10), each with rationale and its v0.1 enforcement mechanism.
- [docs/DECISIONS.md](docs/DECISIONS.md) — dated decision records (D1…D9).
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — Vercel and local deployment, public APIs, rate limits, graceful degradation.
