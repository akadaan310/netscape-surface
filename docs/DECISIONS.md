# Decisions

Dated decision records for Netscape v0.1. Format: question, constraints,
options, decision, consequences. Statuses: **accepted** · **rejected** ·
**deferred** · **proposal**.

---

## D1 — The repository keeps the name `netscape-surface`

**Date:** 2026-10-01 · **Status:** accepted

**Question.** What is this thing called — the repo, the app, the architecture?

**Constraints.** "Do not assume the name is the architecture" (directive).
`golden-surface` is already the Expo app's name; reusing it would conflate
the web room with the native room. The working title "Netscape — Infinite
Surface" was issued with the build directive and no stronger candidate
emerged.

**Decision.** The repo and the Next.js app are `netscape-surface`. "Netscape"
names the surface; it does not name the architecture — the architecture is
the surface model + participant adapters + event log described in
ARCHITECTURE.md, and it would survive a rename.

**Consequences.** Docs refer to "Netscape" for the product and
"netscape-surface" for the repo. If a better name arrives, it renames the
product, not the model.

## D2 — Next.js 14 + TypeScript + Tailwind, App Router

**Date:** 2026-10-01 · **Status:** accepted

**Question.** Which stack for the web embodiment?

**Constraints.** Must deploy to Vercel with zero config (the human's
standing preference: fastest setup, agent-managed infra). Should share
ecosystem DNA with the NetGov ACSP implementation so a future ACSP mapping
speaks the same stack.

**Options.** Next.js 14 / plain Vite SPA / the purl zero-dependency Node
style. Vite is lighter; purl's style is purer. Next.js wins on ecosystem
compatibility with the ACSP reference build and on Vercel zero-config.

**Decision.** Next.js 14, TypeScript, Tailwind, App Router.

**Consequences.** `npm install` is required (unlike purl's zero-dep style —
a deliberate, recorded tradeoff). Server components stay presentation-only
in v0.1; all surface state lives client-side.

## D3 — vitest for tests

**Date:** 2026-10-01 · **Status:** accepted

**Question.** Test runner.

**Constraints.** Must fit the Vite/Next toolchain without a second config
universe; must run in CI and on Vercel builds.

**Decision.** vitest. `npm test` runs the suite: surface model, adapter
contracts (label presence — INV-07), event schema (actor required — INV-10),
embed-honesty (refusal → EXTERNAL card — INV-08), and the "Come here"
round trip (attach/detach identity — INV-05).

## D4 — NASA APOD via the public `DEMO_KEY`

**Date:** 2026-10-01 · **Status:** accepted

**Question.** Which live data demonstrates a real adapter without any
credential?

**Constraints.** INV-09: no secrets in the repo or client. The demo needs at
least one genuinely live surface or the "real vs simulated" table is empty.

**Decision.** `api.nasa.gov` APOD with the public `DEMO_KEY`. It is a
published demo key, rate-limited (~30 req/hr/IP), not a secret — treated as
a constant, committed openly, documented as such.

**Consequences.** Rate limiting is expected and handled by graceful
degradation (DEPLOYMENT.md): a limited key yields an honest card, never
fabricated content, never a retry storm.

## D5 — 7u as a simulated adapter, explicitly labeled

**Date:** 2026-10-01 · **Status:** accepted

**Question.** How does an AI participant appear in v0.1 with no live model
wired?

**Constraints.** INV-07: no simulated adapter ever presents as live. The
participant must be a real co-inhabitant of the demo (attachable via "Come
here") without implying a model is behind it.

**Decision.** 7u ships as a `SIMULATED` adapter: scripted/canned responses,
no network path to any model, the SIMULATED badge rendered on its card,
every attached layer, and every observatory row.

**Consequences.** The demo's central move ("Come here": NASA → NASA+7u)
exercises attachment mechanics truthfully — what is demonstrated is the
*joining*, not the intelligence. Wiring a live model later is a new adapter,
not a flag flip on this one.

## D6 — localStorage persistence for v0.1

**Date:** 2026-10-01 · **Status:** accepted

**Question.** Where does Surface State live?

**Constraints.** v0.1 is a single-human surface: one person, one browser, no
accounts, no backend. INV-09 forbids anything credential-shaped in state.

**Decision.** Surface State (open surfaces, attachments, event log tail)
persists to localStorage and rehydrates on load. No server, no database, no
sync.

**Consequences.** State is device-local and human-local — which is exactly
the privacy posture v0.1 wants. Multi-device or multi-human continuity is
deferred; when it arrives it will be designed against INV-01 (continuity ≠
identity), not bolted on.

## D7 — ACSP checkpoint/handoff mapping marked PROPOSAL, not implemented

**Date:** 2026-10-01 · **Status:** proposal

**Question.** Does v0.1 interoperate with a live ACSP server (checkpoints,
handoffs, TOKs)?

**Constraints.** The mapping is designed (demo surface D presents the
protocol faithfully) but no wire code exists, no server is configured, and
claiming interop without it would violate INV-07's spirit.

**Decision.** The mapping is documented as PROPOSAL in ARCHITECTURE.md and
rendered as a labeled document surface only. Not implemented, not stubbed
to look implemented.

**Consequences.** Demo surface D is honest about what it is: a document, not
a connection. A future ADR will decide the real mapping — likely against the
NetGov implementation (D2's ecosystem choice anticipates this).

## D8 — Embed honesty: the EXTERNAL card, no control defeat

**Date:** 2026-10-01 · **Status:** accepted

**Question.** What happens when a site refuses to be framed?

**Constraints.** INV-08: the web security model is never weakened for a demo.
The surface must still be useful when embedding fails.

**Decision.** Embed where the target allows; where framing is refused,
render a first-class EXTERNAL card — origin, what was attempted, the
refusing header, a plain link. Never proxy to strip headers, never spoof,
never work around.

**Consequences.** Some surfaces will be cards, not windows. That is the
honest rendering, and the docs say so plainly rather than apologizing for it.

## D9 — The Participant/Principal distinction

**Date:** 2026-10-01 · **Status:** accepted

**Question.** purl already has "Principal" (an account that authenticates and
acts). Does Netscape reuse it for its co-inhabitants?

**Constraints.** The surface must admit participants that have no account:
websites, documents, simulated AIs. Forcing them into an account shape would
either invent fake principals or exclude them.

**Decision.** Keep both terms with separate scopes (NOMENCLATURE.md):
purl's Principal = the means of acting (account, rights, grants); Netscape's
Participant = anything that takes part, acting through zero or more
principals. Never require a participant to be a principal.

**Consequences.** The event schema records `actor` as a participant id, which
may have no account behind it. If a future version speaks PURL on the wire,
participants needing rights get bound to principals then — and only then.
