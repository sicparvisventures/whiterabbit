# Plan 0001: Synthetic Defence Vertical Slice

- Status: implementation-ready plan; code and dependencies await separate authorization
- Date: 2026-08-13
- Scope: Specification 0003 only
- Delivery rule: tests first, small atomic commits, strict memory validation, frequent push

## Outcome

Deliver an English-language synthetic system in which an operator signs in, enrolls
an iPhone, starts visible foreground `Sentry Mode`, produces signed synthetic ALPR,
object, and biometric candidate events locally, and reviews them in a premium desktop
command center. Raw video stays on the node, candidate evidence expires within 24
hours, public projection/federation remain disabled, and every critical authority or
security failure denies processing.

## Start Conditions

Before phase P1 begins:

- product owner explicitly authorizes implementation and the first dependency batch;
- Gate G0 is recorded as implementation-approved, not only planning-approved;
- exact package-manager/Node/Expo/Next/Supabase version set is rechecked and pinned;
- no cloud resource, model weight, dataset, real identity or real camera feed is added;
- the threat table has an implementation owner for TM-001 through TM-013.

## Target Repository Shape

```text
apps/mobile/                 Expo/React Native node and field app
apps/web/                    Next.js desktop command center
packages/contracts/         schemas, canonicalization and generated types
packages/policy/            controller/capability/state decisions
packages/api-client/        typed transport, errors, cursor and idempotency
packages/design-tokens/     shared semantic status/type/spacing tokens
packages/edge-core/         lifecycle, outbox, health and pipeline orchestration
packages/inference-port/    detector/embedder/runtime interfaces
packages/watchlists/        signed package verification and local matching
packages/model-registry/    artifact metadata and approval policy
supabase/                    local config, migrations, RLS and functions
tests/fixtures/synthetic/   generated events, plates, faces and media only
docs/evaluations/           reproducible synthetic device/model reports
```

Use a pnpm workspace. Turborepo is optional and requires evidence that it materially
improves task orchestration; the first scaffold can use pnpm workspace commands only.

## Dependency Approval Batches

### Batch D1 — foundation

- current supported Node.js LTS, pnpm, TypeScript and test runner;
- current supported Expo SDK/React Native, Expo Router, development client and camera;
- current supported Next.js/React and Supabase JavaScript/SSR clients;
- one schema validator/code-generation strategy;
- lint/format tooling with pinned versions.

### Batch D2 — identity and device

- secure platform key/signing adapter with verified P-256 behavior;
- secure local encrypted storage/outbox adapter;
- QR/deep-link and keep-awake/lifecycle/thermal/power primitives;
- no device-attestation claim until it is measured on the supported iOS tier.

### Batch D3 — visualization

- accessible component primitives and one consistent icon family;
- map/table/virtualization packages only after bundle, licence and accessibility review;
- no proprietary Palantir assets or imitation component library.

### Batch D4 — inference

- ONNX Runtime React Native and any alternative native/Core ML adapter as benchmark
  candidates, not automatic production choices;
- exact detector, ALPR/OCR, object and embedding models reviewed separately from code;
- no InsightFace community weights or scraped/reference datasets without explicit
  rights and model-risk approval.

Each batch gets a licence/provenance ADR, lockfile diff, SBOM delta, vulnerability
check, build-size impact and rollback note before merge.

## Critical Path

```text
P0 plan
 -> P1 workspace and quality gates
 -> P2 executable contracts and policy
 -> P3 local auth, tenancy and RLS
 -> P4 node enrollment, keys and signed heartbeat
 -> P5 mobile Sentry lifecycle without ML
 -> P6 signed outbox and ingest
 -> P7 object and ALPR synthetic pipeline
 -> P8 biometric synthetic benchmark
 -> P9 review and desktop operations
 -> P10 retention, audit and security hardening
 -> P11 synthetic release candidate
```

P9 can begin its read-only shell after P3, but consequential review mutations wait
for P2/P3/P6 contracts. P8 cannot begin until Gate G1 approves the exact runtime and
model artifacts.

## P0 — Planning Package

Status: **complete**.

Deliverables: Specs 0001–0004, ADR-0004–0006, Architecture 0001, Product Experience
0001, Compliance 0001, the threat model and this plan.

Verification: links resolve, documents agree on scope/auth/client/retention/public
boundaries, unit tests pass, strict memory validation passes, commits are public.

## P1 — Workspace and Quality Gates

Goal: a minimal monorepo that builds no product behavior yet.

Ordered tasks, each limited to at most five implementation files:

1. Add root workspace manifests, pinned engines and deterministic scripts.
2. Add TypeScript/lint/format bases without feature code.
3. Extend CI with install, lint, typecheck, unit test, build and dependency-review jobs;
   pin GitHub Actions by immutable commit where policy requires it.
4. Add repository-wide secret scanning, generated-fixture validation and licence/SBOM
   checks without weakening current memory tests.
5. Scaffold empty `apps/mobile`, `apps/web` and first shared package incrementally; do
   not generate all folders in one commit.

Acceptance:

- clean install/build/tests from a fresh checkout;
- no postinstall network surprises or unreviewed native code;
- CI least-privilege permissions and no production secret requirement;
- current nine memory tests still pass.

Verify: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`,
`pnpm build`, Python tests, SBOM/licence/secret checks and strict memory validation.

## P2 — Contracts and Fail-Closed Policy

Goal: make Specs 0001, 0002 and 0004 executable before a UI or database can grant
authority.

1. Write failing tests for controller profiles, classifications, data nature,
   capabilities, biometric modes and unknown-value denial.
2. Implement schemas/types with a single source of truth and generated JSON fixtures.
3. Write golden RFC 8785/ES256 vectors and negative signature/canonicalization tests.
4. Implement pure authority, package, event and state-transition decisions with stable
   allow/deny reason codes.
5. Add cross-purpose/profile/model/expiry/revocation/review/public-projection abuse
   fixtures; biometrics must have no public transition.

Acceptance:

- all invalid/unknown/missing contexts deny;
- mobile/server fixtures produce identical canonical bytes and verification results;
- no component, RLS policy or feature flag can create authority outside policy output;
- every outcome is deterministic and auditable.

Verify: contract/policy unit, property and golden-vector tests plus TypeScript strict
mode and mutation/coverage threshold agreed before implementation.

## P3 — Local Supabase Auth, Tenancy and RLS

Goal: synthetic local control plane with two adversarial tenants.

1. Add local Supabase config and initial deployment/membership/role schema migration.
2. Write failing RLS tests for unauthenticated, `aal1`, `aal2`, cross-tenant, revoked
   membership and role-change cases.
3. Implement deny-by-default RLS and server authorization helpers; never accept tenant
   scope from request data alone.
4. Add private synthetic evidence metadata/bucket policies with 24-hour expiry fields;
   bytes are added only after retention tests exist.
5. Implement email/password sign-in, TOTP enrollment/challenge, recovery and sign-out
   shells on mobile/web with session-safe server/client boundaries.

Acceptance:

- two tenants cannot observe existence, count, IDs or evidence of one another;
- every privileged action requires server-verified `aal2`;
- service-role keys never enter browser/mobile bundles;
- SSR creates request-scoped Supabase clients and does not leak sessions across users.

Verify: local database policy tests, API authorization tests, browser auth tests,
mobile auth tests, static bundle secret scan and threat tests TM-001/TM-009.

## P4 — Node Enrollment and Cryptographic Identity

Goal: an admin enrolls one iPhone without converting a user token into a node token.

1. Add failing tests for claim entropy/digest/expiry/single-use, wrong deployment,
   replay, key substitution and maker permission.
2. Implement `aal2` enrollment-claim creation and proof-of-possession completion.
3. Implement P-256 key generation/signing behind an interface; deny unsupported key
   protection rather than silently storing an exportable key.
4. Implement node/request signature verification, nonce/timestamp replay cache, key
   rotation/revocation and audit events.
5. Build mobile QR/deep-link enrollment UX with deployment/capability confirmation and
   signed receipt.

Acceptance:

- user and node credentials are cryptographically and operationally independent;
- stolen/expired/used claims and revoked/rotated keys fail before application work;
- node private key material is never logged/exported/backed up by the app;
- enrollment has an explicit revoke/recover path.

Verify: unit/integration replay races, device test on minimum/current iPhone, secure
storage inspection, log scan and threat tests TM-004/TM-005/TM-009.

## P5 — Mobile Sentry Lifecycle Without ML

Goal: prove trustworthy camera and health behavior before inference.

1. Write lifecycle tests for permission denied, start/stop, background, interruption,
   camera loss, revoke, policy expiry, thermal stop and crash recovery.
2. Build native navigation shell and design tokens with a stable fallback if native
   tabs remain alpha.
3. Implement readiness checklist, one active `expo-camera` preview, capture mask and
   explicit foreground `Sentry Mode`.
4. Implement health state machine, keep-awake, external-power guidance, stale status,
   bounded sampler stub and local diagnostic counters.
5. Validate VoiceOver, Dynamic Type, reduced motion/transparency, 44-point targets,
   safe areas, small phone and landscape.

Acceptance:

- backgrounding always releases the camera and reports stopped;
- remote desired state can stop/revoke but never start capture;
- React does not receive raw frames per preview frame;
- unsafe health states are plain-language and cannot look ready.

Verify: unit/native integration tests, physical-device 60-minute camera soak without
ML, accessibility checklist, network trace and threat tests TM-010/TM-011.

## P6 — Signed Outbox, Ingest and Heartbeats

Goal: one node sends trustworthy minimal events through intermittent connectivity.

1. Test bounded encrypted outbox ordering, TTL, overflow, retry, exact idempotency and
   crash recovery with a controllable clock.
2. Implement heartbeat/event signing with event IDs, counter epoch, monotonic sequence,
   prior digest and server receipt state.
3. Implement strict batch ingest validation in Spec 0004 order and transactional
   high-water/idempotency conflict handling.
4. Add pull-only desired state/package manifest skeleton and immediate revoke lane.
5. Build mobile queue/last-accepted/clock-skew/degraded status and server node-health
   projection.

Acceptance:

- raw frame/full plate/embedding types cannot enter the generic outbox API;
- exact retries are stable; conflicts/gaps/forks are quarantined and alerted;
- a 60-minute offline/online synthetic run produces no duplicate accepted event;
- revocation remains available under normal event rate limiting.

Verify: property/concurrency/failure-injection tests, packet inspection and threat
tests TM-004/TM-005/TM-010.

## P7 — Synthetic Object and ALPR Pipeline

Goal: create minimal synthetic object and plate candidates locally.

1. Approve exact D4 object/ALPR artifacts and add digest/licence/model-registry records.
2. Define inference ports and failing fixture tests; keep runtime/model imports in
   adapters, never policy or UI.
3. Implement bounded sampling, object detection, short-lived tracking, quality gates,
   temporal corroboration and immediate non-candidate disposal.
4. Implement local ALPR normalization/comparison and rotating deployment-scoped plate
   token; no central raw civilian plate field.
5. Produce signed object/ALPR payloads and optional explicitly generated/redacted
   synthetic evidence under the common outbox.

Acceptance:

- network trace contains no raw video/full frame/unapproved plate;
- one OCR/classifier observation cannot confirm or publish;
- model/version/threshold mismatch denies candidate generation;
- workload remains within measured device budgets or enters degraded/stop state.

Verify: synthetic fixture accuracy tests, negative privacy serialization tests,
minimum-device soak and threat tests TM-003/TM-005/TM-010/TM-011.

## P8 — Synthetic Biometric Watchlist Benchmark

Goal: evaluate—not operationalize—local 1:N candidate generation against at most
1,000 generated identities.

1. Pass Gate G1 for exact runtime, detector, embedder and generated fixture method;
   document every code/weight/data licence and digest.
2. Implement signed/encrypted watchlist package verification, scope, model compatibility,
   expiry, rollback prevention, revocation and maker-checker tests.
3. Implement local face detection, quality/pose gate, alignment, volatile embedding,
   bounded similarity search and immediate bystander/non-match destruction.
4. Add temporal corroboration, calibrated synthetic threshold policy and distinct
   `biometric.candidate.v1` generation; never reuse object/ALPR schemas.
5. Run reproducible device/model evaluation and presentation-attack simulations; write
   a signed report with unsafe/no-deploy conclusions allowed.

Acceptance:

- no reference image, embedding or non-match crop leaves the node;
- expired/revoked/wrong tenant/purpose/node/model package prevents embedding/matching;
- every output says candidate and requires human review;
- performance, thermal, memory, battery, FPIR/FNIR and limitations are measured, not
  inferred from model marketing.

Verify: package/policy/negative/network/device tests and threat tests
TM-002/TM-003/TM-004/TM-006/TM-011.

## P9 — Review and Premium Desktop Operations

Goal: reviewers can understand provenance and uncertainty without mistaking data for
identity or current truth.

1. Build desktop shell, route authorization, deployment/classification context and
   accessible semantic tokens before feature panes.
2. Implement node overview/health and candidate queues with cursor pagination,
   staleness, loading, offline, forbidden, revoked and empty states.
3. Implement synchronized synthetic map/table/timeline/inspector selection with exact
   coordinates role-restricted and public projection disabled.
4. Implement evidence grants and optimistic/idempotent review outcomes
   (`CONFIRMED`, `REJECTED`, `INCONCLUSIVE`) with audit receipts.
5. Implement governed synthetic watchlist maker-checker, expiry and revoke UI; keep
   enrollment/policy/bulk workflows desktop-first.

Acceptance:

- user cannot infer cross-tenant existence through errors, counts, cursors or timing
  within tested bounds;
- no UI calls a biometric candidate a match/identity;
- keyboard, screen reader and touch users can complete equivalent review flows;
- maps/tables never hide provenance, classification or data age.

Verify: Playwright flows at 1024/1280/1440/wide, mobile device flows, accessibility
automation plus manual VoiceOver/keyboard review, visual regression, and TM-001/
TM-006/TM-008/TM-009 tests.

## P10 — Retention, Audit and Security Hardening

Goal: close every critical/high synthetic-slice threat with executable evidence.

1. Implement evidence expiry worker, orphan reconciliation, deletion ledger and
   restore-time deletion replay; prove the 24-hour maximum.
2. Implement append-evident audit for authority, auth, node, package, evidence, review,
   deletion, export and security actions without sensitive payload bytes.
3. Add per-class rate/resource limits, parser hardening/fuzzing, circuit breakers,
   stale-health alerts and a protected revoke/emergency-stop lane.
4. Add signed SBOM/provenance, release/environment protection, artifact/model/package
   verification, dependency scanning and incident/rollback runbooks.
5. Execute cross-tenant, insider, stolen-node, package rollback, false-candidate,
   storage/log/backup leak, public-plane and DoS red-team scenarios.

Acceptance:

- every critical/high threat has implemented prevention/detection, tests, owner and
  residual-risk decision;
- expired bytes are absent from primary storage, cache, logs and tested restore;
- no public projection route/schema/credential exists in the pilot deployment;
- incident and revoke exercises succeed without relying on a normal event queue.

Verify: security test suite, fuzz/load/restore/deletion drills, SBOM/provenance
verification, AppSec review and updated threat model.

## P11 — Synthetic Release Candidate

Goal: reproducible public pre-release for synthetic use only.

1. Freeze versions/digests and rerun licence, SBOM, vulnerability and model evidence.
2. Run the complete acceptance matrix on minimum/current supported iPhones and all
   desktop breakpoints/themes/accessibility modes.
3. Produce synthetic demo fixtures, operator guide, security/privacy limitations,
   install/build instructions and upgrade/rollback notes.
4. Tag a signed pre-release only after CI, security review, memory validation and owner
   approval; publish no cloud credentials, operational config or model with unclear rights.
5. Record metrics, failures, open risks and the Gate G2–G6 work required before any
   real pilot.

Release label: `synthetic-preview`; it must not be described as Defence-approved,
operational, production-ready or legally authorized.

## Test Commands Target

```text
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm test:contracts
pnpm test:policy
pnpm test:rls
pnpm test:security
pnpm test:e2e:synthetic
pnpm benchmark:edge --device-profile <approved-profile>
pnpm build
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate --strict
```

Commands become authoritative only when the corresponding scaffold lands.

## Commit and Memory Protocol

- Start each task from a clean worktree and current `memory/INDEX.md` context.
- Write the failing test before logic or behavior.
- Touch at most five implementation files per task; split generated/bulk mechanical
  changes from hand-written logic.
- Run the narrow test after each task and the complete relevant phase suite before
  commit.
- Run the code-review checklist, update specs/ADR when behavior or boundaries change,
  checkpoint memory, and pass strict validation.
- Stage explicit paths, commit with the configured `sicparvisventures` author, and push
  the atomic checkpoint to `main` only when the repository policy permits direct push.
- Never let a hook blindly stage/push the worktree or store chat transcripts.

## Stop Conditions

Stop implementation and reopen the appropriate gate if any of these occurs:

- a real identity, plate, frame, location, watchlist or government configuration is
  proposed for the public repo or synthetic environment;
- a dependency/model/weight/dataset lacks exact provenance, rights or digest;
- iOS key protection, thermal behavior or camera lifecycle cannot meet the contract;
- a tenant/public/biometric boundary depends only on UI hiding or a client tenant ID;
- a model/device slice cannot meet accuracy, disparity or performance safety criteria;
- a critical threat lacks an owner/test/mitigation or a high residual risk is unsigned;
- a provider/telemetry/log/backup path exceeds the approved classification;
- scope expands to police, municipality, operations, intelligence, public output,
  federation, new recipients, longer retention or autonomous action.

The correct result of a benchmark or gate may be `no deploy`. That is a successful
governance outcome, not an engineering failure.
