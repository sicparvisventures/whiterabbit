# Spec: WhiteRabbit Belgian Government-Vehicle ALPR

Status: foundation published; controller-profile direction is under review in Spec 0001.

## Assumptions

1. The product is an English-language, international web application with Belgium as the first compliance and deployment profile.
2. The primary users are authorized Belgian public-sector controllers and their approved operators or processors. Deployment authority and legal basis must be established outside the software.
3. Cameras perform detection locally. Raw video does not leave the device; the cloud receives only minimal events and explicitly permitted, redacted evidence.
4. The project will be public and AGPL-3.0-compatible, with a new name, visual identity, and explicit SparrowMap attribution where code or assets are reused.
5. Supabase and Vercel are candidates for approved non-sensitive deployments. Provider boundaries must support accredited or self-hosted infrastructure for restricted profiles. Long-running inference stays on camera devices.
6. GitHub commits use the repository-local author `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.

## Objective

Build a privacy-first ALPR and visual-event mesh that lets an authorized operator turn an old phone, laptop, webcam, or compatible IP camera into a local detector. Reviewed events remain restricted unless the active controller profile separately authorizes an auditable public projection.

Belgian Defence is the first intended deployment. The same core must support municipalities and police without treating them as one controller or pooling their records. See `docs/specs/0001-belgian-controller-profiles.md`.

The first product is useful for one authorized operator with one camera. Collaboration and federation expand that utility but are never required.

### Core product model

- A **Deployment** is one legally accountable controller, immutable controller profile, and policy boundary.
- A **Space** is an approved operational area inside a deployment.
- A **Node** is a phone, laptop, webcam, or camera gateway that performs local inference.
- An **Event** is a minimal detection such as person, vehicle, animal, motion, tamper, or offline status.
- A **Review** confirms or rejects a candidate record; review alone does not authorize publication.
- A **Circle** is an invite-only sharing relationship between spaces, operators, or deployments.
- A **Bridge** shares narrowly selected event categories for a limited scope and duration. It does not merge historical data or ownership.

### Non-goals for the first release

- No publication of exact camera locations.
- No facial recognition.
- No public or cross-circle civilian licence-plate search.
- No covert surveillance features.
- No central raw-video archive.
- No silent group merge or inherited access to historical events.
- No default publication of military, police, investigative, or protected movements.
- No persistent person identification without a separately approved legal and technical specification.

## Proposed Stack

- Web: Next.js + TypeScript, deployable to Vercel where the profile permits it.
- Backend: PostgreSQL-compatible provider boundary. Supabase Auth, PostgreSQL, RLS, Storage, Realtime, and narrowly scoped functions are candidates for development and approved non-sensitive deployments.
- Restricted hosting: accredited or self-hosted adapters for operational, intelligence, classified, or otherwise excluded profiles.
- Browser node: local WebAssembly/ONNX inference with `getUserMedia`, wake lock, and a foreground-only operating model.
- Desktop node: small Python agent for USB, RTSP, ONVIF, or MJPEG sources and hardware-accelerated inference when available.
- Shared contracts: versioned event schema and signed node envelopes.
- Licence: AGPL-3.0 unless later legal review requires stricter separation from SparrowMap-derived code.

## Commands

Exact commands will be fixed after the scaffold is approved. The intended interface is:

```text
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm build
pnpm memory:check
pnpm memory:bootstrap
```

## Project Structure

```text
AGENTS.md                 durable agent instructions and mandatory handoff rules
BOOTSTRAP.md              human and agent startup sequence
HEARTBEAT.md              compact current-state record
memory/INDEX.md           bounded entry point to durable context
memory/PROJECT.md         vision, users, terminology, and non-goals
memory/STATE.md           current implementation state and next verified action
memory/BACKLOG.md         ordered work with acceptance criteria
memory/RISKS.md           legal, privacy, security, operational, and product risks
memory/decisions/         immutable architecture decision records
memory/sessions/          concise outcomes only; never raw transcripts or secrets
docs/specs/               approved living specifications
docs/architecture/        system, data, trust-boundary, and deployment documentation
.codex/hooks.json         lifecycle hooks for load, compaction, handoff, and validation
scripts/memory/           dependency-free bootstrap, update, heartbeat, and validation tools
apps/web/                 Next.js web control plane
apps/node/                desktop camera node
packages/contracts/       shared event and authorization contracts
supabase/                 migrations, RLS policies, functions, and local configuration
```

## Persistent Memory Contract

1. `SessionStart` loads only `BOOTSTRAP.md`, `HEARTBEAT.md`, and `memory/INDEX.md` into context.
2. `AGENTS.md` requires relevant memory and specs to be read before edits.
3. Before a turn may stop, a `Stop` hook validates that material decisions, state changes, blockers, and next actions were recorded. It may continue the turn once to repair stale memory.
4. `SessionStart` reloads durable context after startup, resume, clear, or compaction. The stop guard keeps the latest material state durable before later compaction can discard chat context.
5. `SessionEnd` performs fast structural validation. It does not parse or publish raw chat transcripts.
6. CI and a pre-commit check verify links, required headings, heartbeat freshness, decision IDs, and absence of common secrets.
7. Memory stores outcomes and evidence, not hidden reasoning, credentials, personal data, or full conversations.
8. Commits are atomic and may be pushed automatically only after validation and only when the worktree contains known in-scope changes. Automatic pushing of every chat message is not a default.

## Code Style

Prefer explicit domain types, small modules, schema validation at trust boundaries, and privacy-preserving defaults.

```ts
export type DetectionEvent = Readonly<{
  nodeId: string;
  occurredAt: string;
  category: "person" | "vehicle" | "animal" | "motion" | "tamper";
  evidenceRef?: string;
}>;
```

## Testing Strategy

- Unit tests for contracts, authorization rules, retention, redaction, and memory tooling.
- Storage integration tests for every RLS/equivalent policy, cross-circle boundary, controller profile, and public projection.
- Browser tests for enrollment, camera permission failure, offline recovery, event review, invite revocation, and bridge expiry.
- Synthetic camera fixtures; no real people's footage in the public test suite.
- Threat-model review before any cross-user sharing feature ships.

## Boundaries

### Always

- Default to local inference, least privilege, short retention, explicit sharing, revocable access, and auditable changes.
- Update the living spec before behavior changes.
- Run relevant tests and memory validation before commits.
- Preserve upstream copyright notices and attribution for reused code.

### Ask first

- Database schema or RLS changes after public beta.
- New production dependencies, biometric capabilities, licence-plate recognition, public-road capture, or longer retention.
- Creating cloud resources, changing billing, merging circles, publishing releases, or changing the licence.

### Never

- Commit or publish secrets, raw transcripts, private footage, exact private camera locations, or production data.
- Build public person/vehicle tracking, covert recording, facial recognition, or silent historical-data merging.
- Represent the product as legal advice or as affiliated with SparrowMap.

## Success Criteria for the Foundation

- A local Git repository named WhiteRabbit exists with the approved repo-local git author.
- A fresh Codex session receives the bounded bootstrap context automatically.
- A stale state file causes the stop/validation flow to request a memory update.
- Memory validation passes locally and in GitHub Actions.
- No raw transcript or secret is written to memory.
- The initial project spec, decision log, risk register, and ordered backlog survive a new AI session without relying on chat history.
- The repository can be made public without exposing operational or personal data.

## Approved Direction and Remaining Gates

1. Approved: WhiteRabbit name, public AGPL project, lawful SparrowMap reuse, frequent validated pushes, Belgian public-sector ALPR core, Defence first, with municipality and police support through separate profiles.
2. Gate: Spec 0001 and proposed ADR-0004 require owner and institutional review before implementation.
3. Gate: real deployment requires an identified authorized controller, exact purpose, legal basis, camera procedure, classification, DPIA decision, retention policy, hosting approval, and security review.
4. Gate: publication requires profile authorization, corroborated evidence, and human review; one OCR or classifier result never suffices.
5. Gate: identifying or persistent person tracking requires a new approved specification, legal basis, DPIA, threat model, and explicit authorization.
