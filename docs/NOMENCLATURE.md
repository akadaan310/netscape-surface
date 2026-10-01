# Nomenclature

Rule (inherited from `purl/NOMENCLATURE.md`): before a term is introduced,
the repository and established vocabulary are searched for an equivalent.
**Most Netscape terms are established terms used in their established sense**;
they are listed so their scope in Netscape is explicit. Genuinely new
coinages are marked **[new]** — there are two ("Surface Context" is
established usage; "Come Here" and "Context Attachment" are new).

Each entry: *type* · *scope* · definition · relationship to existing
terminology · motivation · example · non-example.

---

### Surface
*noun · all layers* — The unit of the human's attention: one addressable
place where a participant's content is encountered. Types: `WEB`, `AI`,
`CODE`, `REPOSITORY`, `DOCUMENT`, `RESEARCH`, `TERMINAL`, `RESOURCE`,
`SESSION`, `ARTIFACT`, `CONFERENCE`.
**Relation:** browser tab / window (established); here a tab generalized to
non-web participants. **Motivation:** the human meets many kinds of
participants in one room; the room needs one word for "where I am looking".
**Example:** the NASA APOD surface (type `WEB`); the 7u surface (type `AI`);
the ACSP document surface (type `DOCUMENT`). **Non-example:** a raw API
endpoint with no rendering — addressable, but not a place the human inhabits.

### Participant
*noun · lib/participants* — Anything that can take part in the surface:
a human, an AI session, a website, a repository, a tool, a document, a
build. Participants act through adapters; a participant may act through zero
or more principals (see Participant vs purl-Principal below).
**Relation:** actor (general); broader than any account system.
**Motivation:** the surface must treat a website, an AI, and a document as
first-class co-inhabitants without forcing them into an account shape.
**Example:** 7u (an AI), `akadaan310/purl` (a repository), the human.
**Non-example:** a Bearer <redacted> — that is a principal, a means of acting,
not a participant.

### Participant Adapter
*noun · lib/participants* — The code that lets one participant appear on the
surface. Capabilities: `discover`, `open`, `attach`, `send`, `receive`,
`observe`, `disconnect`. Every adapter declares an epistemic label
(`live` / `SIMULATED` / `PROPOSAL`); the label is rendered wherever the
participant appears.
**Relation:** driver / plugin (established). **Motivation:** participants
differ wildly (a REST API vs a canned script); the surface needs one narrow
contract to hold them all. **Example:** the GitHub adapter (`live`, reads
public `api.github.com`); the 7u adapter (`SIMULATED`, scripted responses).
**Non-example:** an adapter that presents simulated responses without the
SIMULATED label — forbidden by INV-07, not an adapter at all.

### Surface Context
*noun · lib/context* — Everything the surface currently holds about what is
open: the active surface, its type, its origin, attached participant contexts,
and the epistemic labels in play. It is the surface's working memory of the
present moment — not storage, not history.
**Relation:** session state / view-model (established). **Motivation:** "Come
here" needs a precise object to operate on: it attaches *to the context*, not
to the resource. **Example:** "NASA surface open, APOD 2026-10-01, 7u attached
(SIMULATED)". **Non-example:** the event log — that is Surface State's
history, not the present context.

### Surface Session
*noun · lib/surface* — One continuous inhabitation of a surface by the human:
opened, lived in, closed. A session has exactly one active Surface Context at
a time and emits Surface Events for everything that happens in it.
**Relation:** browsing session (established); here extended to non-web
surfaces. **Motivation:** continuity (what carried over) must be separable
from identity (who is who) — the session is the continuity carrier.
**Example:** this morning's session: NASA → GitHub → ACSP document.
**Non-example:** the GitHub repository itself — the session is the human's
visit, not the thing visited (INV-01).

### Context Attachment
*noun · lib/context* **[new]** — The record that a participant's context is
currently joined to a surface session's context: `{ surface_session_id,
participant_id, actor, at }`. Attachments are separable by construction;
detaching restores the session to exactly its prior state.
**Relation:** join / overlay (established senses). **Motivation:** "Come here"
needed a name for its durable effect — the thing that exists between the
invocation and the detach. **Example:** 7u's context attached to the NASA
surface session. **Non-example:** a merge — attachments never merge
identities (INV-05).

### Surface Object
*noun · lib/surface* — Anything rendered on the canvas that the human can
point at: an image, a card, a document section, a participant badge, an
EXTERNAL card. Objects are inert: they display, they do not act.
**Relation:** DOM node / view object (established). **Motivation:** the
observatory and the event log need a stable referent for "what the human was
looking at". **Example:** the APOD image card; the EXTERNAL card for a site
that refused framing. **Non-example:** the NASA API response JSON — data, not
yet an object on the surface.

### Surface Event
*noun · lib/surface* — One immutable record of something that happened on the
surface: `surface.opened`, `surface.attached`, `surface.detached`,
`participant.observed`, and so on. Every event carries `actor` — every act
identifies its author (INV-10).
**Relation:** event sourcing event (Fowler); W3C PROV Activity.
**Motivation:** the observatory renders the event log; continuity is the fold
of these events. **Example:** `{ kind: "surface.attached", actor: "human",
surface_session_id: "s_…", participant_id: "7u", at: … }`.
**Non-example:** a participant's internal state change the surface never saw —
no event, no record.

### Surface State
*noun · lib/state* — The fold of the surface's event log: which surfaces are
open, which contexts are attached, what the observatory shows. Persisted to
localStorage in v0.1 (single-human surface); rehydrated on load.
**Relation:** event-sourced state (established). **Motivation:** the human
closes the tab and returns; the room should be as they left it.
**Example:** the persisted record "NASA surface open, 7u attached".
**Non-example:** the NASA image bytes — state records *that* the surface is
open, not the remote content.

### Come Here
*verb · lib/context, components/participants* **[new]** — The primitive that
attaches a participant's context to the active surface session, as a labeled,
separable layer, without merging identities. Before: surface S with its own
context. After: surface S with its own context *plus* the participant's
context, each labeled. Detach reverses it exactly.
**Relation:** "bring X into the room" (ordinary language); the URL-MACHINE's
session-joining, restated for a human surface. **Motivation:** the demo's
central move needed a name the human can say. **Example:** "7u, come here" —
before: NASA; after: NASA + 7u (SIMULATED badge visible).
**Non-example:** opening 7u in a second tab — co-presence without attachment;
or any operation that would merge the two contexts into one unlabeled view.

---

## Participant vs purl-Principal — the distinction

purl's **Principal** is an account on an instance that can authenticate and
act (kinds: `human`, `agent`, `service`, `instance`). A principal is the
*means* of acting: it holds rights, appears in grant chains, and is bound to
tokens. **[ESTABLISHED — OBSERVED in `purl/NOMENCLATURE.md`]**

Netscape's **Participant** is broader: a human, an AI, a website, a
repository, a tool, a document, a build. A participant *may* act through zero
or more principals — a website participant typically acts through none; a
human participant may hold several; a simulated AI participant acts through
none at all, because it does not act on anything real.

The rule: **never require a participant to be a principal.** Where authority
matters (it barely does in v0.1 — opening never mutates), the surface records
the *actor* on the event, which may be a participant with no account behind
it. If a future version speaks PURL on the wire, participants that need
rights will be bound to principals then — and only then.

**Example:** 7u is a Participant (AI, SIMULATED adapter) and no principal.
The human is a Participant and, for localStorage purposes, needs no principal
either. **Non-example:** treating the GitHub API's rate-limit identity as a
participant — that is a transport detail, not a co-inhabitant of the room.
