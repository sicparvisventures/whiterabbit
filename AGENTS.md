# WhiteRabbit Agent Instructions

These instructions apply to the entire repository.

## Startup

1. Read `BOOTSTRAP.md`, `HEARTBEAT.md`, and `memory/INDEX.md` before planning work.
2. Follow links from the index only when relevant to the current task.
3. Run `python3 scripts/memory/memory_tool.py validate` before editing.
4. Read the active specification and architecture decisions before changing behavior.

## Durable Memory

- Repository memory is the source of truth across AI sessions; chat history is not.
- Record durable outcomes, evidence, decisions, blockers, and the next verified action.
- Never store hidden reasoning, raw transcripts, credentials, production data, footage, exact private camera positions, civilian plates, or personal identifiers in memory.
- Update `memory/STATE.md` when implementation state changes.
- Update `memory/BACKLOG.md` when task order or acceptance criteria change.
- Add an ADR in `memory/decisions/` before changing architecture, privacy posture, licensing, data retention, or public/private data boundaries.
- Before handoff, refresh `HEARTBEAT.md` with:
  `python3 scripts/memory/memory_tool.py checkpoint --summary "<outcome and next action>"`.
- Finish with `python3 scripts/memory/memory_tool.py validate --strict`.

## Product Guardrails

- WhiteRabbit is an open-source ALPR and visual-event platform for legally authorized Belgian public-sector deployments, with internationalization later.
- A public map may show a government-vehicle event only when the active controller profile explicitly permits publication and corroborated evidence plus human review confirm it. Military, police, investigative, and protected movements are restricted by default.
- OCR, a single classifier, or one unverified camera must never independently publish a plate or identity.
- Civilian plate text must not be persisted centrally. Any necessary local comparison must use short-lived, rotating, deployment-scoped pseudonyms and approved retention.
- Raw video remains on the node. Upload only minimal signed events and explicitly permitted, redacted evidence.
- Person and object detection defaults to non-identifying categories and counts. Facial recognition, persistent person re-identification, covert surveillance, or public person search require a new approved spec, legal basis, DPIA, threat model, and explicit owner authorization.
- Treat exact camera coordinates, node tokens, signing keys, and unredacted evidence as sensitive.
- “For the Belgian state” means deployment by or for an authorized controller; it does not confer authority on this repository or its contributors.
- Defence, armed-forces operations, intelligence, police, and municipalities use separate fail-closed controller profiles. Never pool or relabel their histories; sharing requires an explicit, scoped, audited bridge.
- Supabase and Vercel are candidates only for approved classifications and profiles. Never route classified, operational, intelligence, or police-investigation data through the public SaaS topology.

## Engineering Workflow

- Use spec-driven development for new features and architecture changes.
- Use test-driven development for logic and behavior changes: failing test, minimal implementation, refactor.
- Deliver multi-file work in small verified slices.
- Run the relevant tests after each slice and the full suite before publishing.
- Prefer privacy-preserving defaults, least privilege, explicit schemas, and short retention.
- Do not add production dependencies, cloud resources, database migrations, biometric features, or retention changes without approval.

## Git and Publication

- Repository-local author: `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.
- Use frequent atomic commits after tests and strict memory validation pass.
- Stage explicit in-scope paths. Never publish secrets, operational data, raw transcripts, private footage, or unrelated user changes.
- Keep the repository public and AGPL-3.0-compatible.
- Preserve SparrowMap copyright notices and document reused or adapted code in `NOTICE.md`.
- Use WhiteRabbit naming and assets; never imply affiliation with SparrowMap.

## Current Foundation Commands

```text
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate
python3 scripts/memory/memory_tool.py bootstrap
python3 scripts/memory/memory_tool.py checkpoint --summary "..."
python3 scripts/memory/memory_tool.py validate --strict
```
