# Architecture

Epistemic labels are used throughout. Each label means what it says:
**AXIOM** — taken as given, argued from nowhere inside this document.
**DERIVED** — follows from an axiom or an established fact.
**ESTABLISHED** — shown by this repository's own tests or by direct observation.
**OBSERVED** — seen in a specific artifact named alongside.
**SIMULATED** — produced by a stand-in, labeled at the point of use.
**INFERRED** — a reasonable reading of incomplete evidence.
**HYPOTHESIS** — a claim offered for testing, not relied upon.
**UNRESOLVED** — open; no decision taken.
**DISPROVEN** — tested and failed.

Netscape's mode as a component is **runtime** (it executes) and **observational**
(it records what happened). It is not normative for any protocol and not
experimental in the research sense: it builds on research artifacts, it does
not run them.

## The system map

Four modes recur below. **Normative** = defines what others must do inside its
scope. **Runtime** = executes live behavior. **Observational** = records
without changing what it records. **Experimental** = built to learn, may be
discarded.

### SEURL — the URL state machine

- **Owns** the seven-verb protocol (START, SWITCH, WRITE, COMMIT, BUILD, TALK,
  PERTURB), the `seurl://` address namespace (minted only here — the standing
  rule "mint seurl:// only, never purl://" is SEURL's own and stays SEURL's),
  and the message envelope rule *every act identifies its author*.
  **[ESTABLISHED — OBSERVED in `seurl/README.md`]**
- **Exposes** a static halt page and the verb vocabulary.
- **Must NOT own** authentication, persistence, or the human's browser.
- **Mode:** normative within its own namespace; experimental as a program model.
- **Netscape relationship:** OBSERVED reference only. Netscape v0.1 does not
  implement SEURL verbs and does not mint `seurl://` addresses. The author-on-
  every-act rule is adopted as INV-10.

### PURL — the programmable-URL protocol

- **Owns** the protocol (addressable versioned resources, operations with
  required rights, grants and attenuation, hash-chained event logs,
  checkpoints and handoff) and the `purl://` namespace.
  **[ESTABLISHED — OBSERVED in `purl/SPEC.md`, `purl/NOMENCLATURE.md`]**
- **Exposes** the protocol specification and a zero-dependency reference
  implementation.
- **Must NOT own** human-facing orchestration; it is a server protocol, not a
  client surface.
- **Mode:** normative for PURL/0.1; the Layer 2 research substrate is
  experimental/observational.
- **Netscape relationship:** conceptual alignment + one hard distinction
  (NOMENCLATURE.md: Participant vs purl-Principal). Netscape v0.1 does not
  speak PURL on the wire. The GitHub demo surface (B) opens `akadaan310/purl`
  as a *repository* — it reads the repo's public metadata, not the protocol.

### ACSP — the continuity protocol

- **Owns** the four invariants (continuity ≠ identity, reference ≠ ownership,
  awareness ≠ authority, handoff ≠ merger), the TOK / checkpoint / handoff
  vocabulary, and the machine-readable protocol document.
  **[ESTABLISHED — OBSERVED in `NetGovComEduGovOrgEduGovComNet/PROTOCOL.md`]**
- **Exposes** ACSP/0.1 as a document and `/protocol.json` schema.
- **Must NOT own** any particular implementation; the protocol is separable
  from the NetGov build.
- **Mode:** normative for the NetGov ACSP implementation; observational as a
  document surface inside Netscape.
- **Netscape relationship:** demo surface D renders ACSP/0.1 as a document.
  Checkpoint/handoff interop with a live ACSP server is a **PROPOSAL**
  (DECISIONS.md D7), explicitly not implemented in v0.1. Six of Netscape's ten
  invariants are ACSP invariants restated for a client surface.

### substrateIO — the research substrate

- **Owns** reproducible experiments on computation as state transformation
  (EXP-A…G), the Research Continuity Protocol, epistemic-status guards, and
  content-addressed runs. **[ESTABLISHED — OBSERVED in `substrateIO/README.md`]**
- **Exposes** instruments, not services: tests, validators, provenance tools.
- **Must NOT own** anything user-facing or anything that executes on behalf
  of a human.
- **Mode:** experimental (falsifiable by design) and observational.
- **Netscape relationship:** Netscape borrows the epistemic discipline (the
  nine labels above descend from substrateIO's status guards) and applies it
  to a live surface. No runtime dependency. **[DERIVED]**

### Golden Surface (Expo app) — the native agent-space client

- **Owns** the native room: shared browser with per-tab ownership
  (Abed / ر / ن), the Najwa conference screen, relay-driven remote control,
  and the standing visual register — *dark, quiet counsel room, not a feed*.
  **[ESTABLISHED — OBSERVED in `golden-surface/SPEC.md`]**
- **Exposes** a phone-native surface; nothing web-facing.
- **Must NOT own** the web embodiment — that is Netscape's scope.
- **Mode:** runtime.
- **Netscape relationship:** sibling, not predecessor. Netscape carries the
  same visual register (dark, quiet) to the web. Neither replaces the other;
  the Expo app is the native room, Netscape is the web room.

### MUSA — the Luna agent-space program

- **Owns** the URL-MACHINE protocol sheet: one harness, many sessions, each
  session stateless except its URL; TALK routed through the harness, never
  peer-to-peer. **[ESTABLISHED — OBSERVED in
  `MUSA/luna-agent/protocols/url-machine.md`]**
- **Exposes** protocol sheets and the Luna bridge (shell/loom); no web
  client of its own in this scope.
- **Must NOT own** the surface layer — the machine is the computer, the
  surface is where the human meets it.
- **Mode:** normative within its own program; experimental as an
  architecture.
- **Netscape relationship:** design lineage. "Come here" is a client-side
  realization of attaching a session's context to a shared locus without
  merging sessions — the URL-MACHINE's session separation, restated for a
  human surface. No code shared, no runtime coupling. **[INFERRED lineage,
  DERIVED mechanism]**

### NetGov ACSP implementation — the reference build

- **Owns** one concrete ACSP/0.1 server (Next.js, `/r/{id}`, capabilities,
  TOK handoff). **[ESTABLISHED — OBSERVED in the repo's `app/`, `src/`,
  `tests/`]**
- **Exposes** a deployable protocol endpoint (acsp-one.vercel.app).
- **Must NOT own** the human surface or the protocol definition itself.
- **Mode:** runtime + normative-within-itself.
- **Netscape relationship:** DECISIONS.md D2 chose Next.js 14 partly for
  ecosystem compatibility with this implementation — so a future ACSP mapping
  speaks the same stack. No runtime calls in v0.1. **[DERIVED decision]**

## Netscape's place

Netscape is the **human-facing orchestration boundary over these systems** —
a client surface, not a replacement for any of them:

- It does not implement protocols (SEURL, PURL, ACSP) — it *surfaces* them.
- It does not run research (substrateIO) — it *applies* its epistemic labels.
- It does not replace the Expo app (Golden Surface) — it is the web room to
  the Expo app's native room.
- It does not mint `purl://` or `seurl://` addresses. **[AXIOM — namespace
  discipline inherited from both protocols]**

What it owns outright: the surface model, the participant registry and
adapters, surface sessions and context attachments, the event log, the
observatory, and the honesty of the frame (embed where allowed, EXTERNAL
card where blocked).

## Directory shape

```
netscape-surface/
├── app/                          # Next.js App Router routes (/, /surface/[id], /observatory)
├── lib/
│   ├── surface/                  # surface model, sessions, events, epistemic labels
│   ├── participants/             # participant registry + adapters (live + simulated)
│   ├── context/                  # surface context, context attachments
│   ├── state/                    # persistence (localStorage in v0.1)
│   └── observatory/              # event log, filters, export
├── components/
│   ├── chrome/                   # shell: header, surface switcher, observatory toggle
│   ├── canvas/                   # surface rendering: embeds + EXTERNAL cards
│   ├── participants/             # participant cards, "Come here" control
│   └── observatory/              # event stream view
├── docs/
│   ├── ARCHITECTURE.md
│   ├── NOMENCLATURE.md
│   ├── CONSTITUTION.md
│   ├── DECISIONS.md
│   └── DEPLOYMENT.md
└── tests/                        # vitest
```

## Data flow of "Come here"

"Come here" attaches a participant's context to the active surface session.
It moves no data between participants and merges nothing.

```
1. human ──"come here"──► active surface session S, targeting participant P
2. P.adapter.context() ──► context handle H
     (a summary + label; never credentials, never live keys — INV-09)
3. context.attach(S, H) ──► attachment A = { surface_session_id: S.id,
                                             participant_id: P.id,
                                             actor: "human",
                                             at: <timestamp> }
4. event log ◄── surface.attached { A, label: P.adapter.epistemic_label }
5. canvas renders S with H as a labeled, separable layer
     (P's badge stays P's; S's identity is unchanged — INV-01, INV-05)
6. detach(S, P) reverses 3–5; S returns to exactly its prior state — INV-04
```

Each step is a Surface Event carrying its actor (INV-10). The observatory
shows steps 1–6 as they happen; nothing in this flow touches the underlying
resources (the NASA API, the GitHub API, the ACSP document) — opening and
attaching never mutate. **[DERIVED from INV-04, INV-05, INV-10]**

## The web-security honesty model

Framing a third-party site in an `<iframe>` is controlled by that site
(`X-Frame-Options`, `Content-Security-Policy: frame-ancestors`). Netscape
never defeats these controls — not for a demo, not ever (INV-08).

- **Embed where allowed.** If the target permits framing, the surface renders
  it in place, with the origin shown in the surface chrome.
- **Honest EXTERNAL card where framing is blocked.** If the target refuses
  framing, the surface renders a card that says so: the origin, what was
  attempted, why it was refused (the header the site sent), and a plain link
  the human can open themselves. The card never implies the content is
  inside the surface.
- **Never defeat controls.** No proxying to strip headers, no user-agent
  spoofing, no clickjacking-shaped workarounds. A surface that cannot show
  something says so.

The EXTERNAL card is a first-class surface rendering, not an error state.
**[AXIOM — the web's security model is not ours to weaken]**
