# Constitution

Ten invariants. Each carries a status (one of the nine epistemic labels),
a one-paragraph rationale, and the concrete mechanism by which v0.1 enforces
it. Invariants are not goals; they are the walls of the room. Six restate
ACSP invariants for a client surface; four are Netscape's own.

---

### INV-01 — Continuity does not imply identity

**Status: AXIOM** (inherited from ACSP/0.1, invariant 1).

A session that carries state forward is not the session that wrote it, and a
surface that shows two participants together has not made them one. The human
must never be led to believe that shared context is shared selfhood — that
confusion is where authority leaks in unnoticed.
**v0.1 enforcement:** every Surface Context renders each participant under
its own badge with its own epistemic label; the session's continuity record
(the event fold) is stored separately from participant identities, and the
observatory shows "session s_… carried context from …" as a transport fact,
never as an identity claim.

### INV-02 — Reference does not imply ownership

**Status: AXIOM** (inherited from ACSP/0.1, invariant 2).

Opening the `akadaan310/purl` repository surface, citing the ACSP document,
or displaying NASA's picture gives the surface no ownership over those
things and takes none from their owners. A surface that displays must not
present itself as the source.
**v0.1 enforcement:** every surface chrome shows origin (domain, repo path,
document source) distinct from the surface's own identity; Surface Objects
carry `origin` metadata; nothing in the surface model has an "owner" field
for remote resources.

### INV-03 — Awareness does not imply authority

**Status: AXIOM** (inherited from ACSP/0.1, invariant 3).

Knowing a surface exists, reading its content, or attaching a participant's
context confers no power over the underlying resource. In v0.1 this is easy
to hold because the surface has almost no mutation powers at all — and it
must stay easy: no future capability may be smuggled in through the reading
path.
**v0.1 enforcement:** adapters expose only the seven declared capabilities
(`discover/open/attach/send/receive/observe/disconnect`); `send` on a live
adapter is read-scoped in v0.1 (fetch, never POST/PUT/DELETE); there is no
code path from "the human saw it" to "the human changed it".

### INV-04 — Access does not imply control

**Status: AXIOM** (Netscape's own; the client-surface form of GET-safety).

Opening a surface never mutates the underlying resource. This is the web's
oldest safety property (RFC 9110 §9.2.1: GET is safe), restated as a wall:
prefetchers, link unfurlers, and curious humans all open things they merely
noticed, and none of them may change anything by looking.
**v0.1 enforcement:** all live adapters issue GET only; no adapter holds
credentials; detach restores a session to exactly its prior state (no residue
in the remote resource, because nothing was ever written to it).

### INV-05 — Handoff does not imply merger

**Status: AXIOM** (inherited from ACSP/0.1, invariant 4).

"Come here" joins a participant's context to a surface session; it does not
merge the participant into the session or the session into the participant.
Contexts stay separable, labeled, and detachable — before and after are both
fully describable states.
**v0.1 enforcement:** Context Attachment is a separate record, not a merged
view-model; the canvas renders attached contexts as distinct layers with
their own badges; `detach` is a first-class operation and the demo
walkthrough demonstrates the round trip (NASA → NASA+7u → NASA).

### INV-06 — Observation does not imply interpretation

**Status: DERIVED** (from the substrateIO discipline: record without
assigning meaning prematurely).

The observatory shows what happened — events, actors, timestamps. It does not
say what it means, whether a claim is true, or what the human should conclude.
Interpretation is the human's (or a participant's) job; the log's job is to
be faithful.
**v0.1 enforcement:** Surface Events carry facts only (`kind`, `actor`,
`at`, ids, labels); the observatory renders the stream verbatim with filters,
never summaries; no "insights", no sentiment, no auto-narration anywhere in
v0.1.

### INV-07 — Simulation is labeled

**Status: AXIOM** (Netscape's own; the honesty wall).

No simulated adapter ever presents as live. A human who cannot tell whether
they are talking to a model or a script has been deceived, whatever the
intent — and a surface built for inhabiting the web together cannot begin
with deception about who is in the room.
**v0.1 enforcement:** the epistemic label is a required adapter field,
rendered on the participant card, on every attached context layer, and in
the observatory; the 7u adapter is hardcoded `SIMULATED` with scripted
responses and no network path that could be mistaken for a live model; tests
assert the label is present wherever a simulated participant appears.

### INV-08 — The web security model is never weakened for a demo

**Status: AXIOM** (Netscape's own).

Framing controls (`X-Frame-Options`, `frame-ancestors`), mixed-content
rules, and credential boundaries exist to protect the human. No demo is
worth drilling through them — and a surface that defeats them once cannot be
trusted about anything else.
**v0.1 enforcement:** embed only where the target permits; otherwise render
the honest EXTERNAL card (origin, what was attempted, the refusing header,
a plain link); no header-stripping proxies, no user-agent spoofing, no
clickjacking-shaped workarounds — see ARCHITECTURE.md "web-security honesty
model". Tests assert that framing refusal produces a card, not a bypass.

### INV-09 — No secrets in the repo or client state, ever

**Status: AXIOM** (Netscape's own; standing rule).

API keys, tokens, and credentials do not belong in the repository, in
client-side state, in URLs, or in the event log. The NASA `DEMO_KEY` is a
public demo key, not a secret, and is treated as a constant — the day a real
key is needed, it lives server-side or in the human's hands, never in the
client.
**v0.1 enforcement:** no credential fields exist in the surface model, the
adapter contract, or the event schema; adapters receive no secrets; the
context handle passed by "Come here" carries summary + label only; tests
assert no `key`/`token`/`secret` query parameters are ever constructed.

### INV-10 — Every act identifies its author

**Status: AXIOM** (inherited from SEURL's message envelope and the
URL-MACHINE: "every act identifies its author; no unsigned speech").

A surface where things happen without authors is a surface where nothing can
be questioned. Every Surface Event carries `actor`; every attachment names
who invoked it; every simulated response is attributable to its adapter.
**v0.1 enforcement:** `actor` is a required field on the event schema
(human / participant id / system); the observatory renders actor on every
row; the "Come here" flow records the invoking human and the attached
participant as separate facts; tests reject events without actors.
