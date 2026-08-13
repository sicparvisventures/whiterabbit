# Backlog

Tasks are ordered by dependency. A task is not complete until its verification succeeds and durable memory is updated.

## Phase 0: Durable Foundation

- [x] Clone and inspect SparrowMap without modifying upstream.
  - Acceptance: clean checkout, licence and architecture identified.
  - Verify: `git -C sparrowmap status --short --branch`
- [x] Implement memory validation and lifecycle hooks test-first.
  - Acceptance: startup context is bounded; stale memory triggers one repair turn; secrets and broken links fail validation.
  - Verify: `python3 -m unittest discover -s tests -v`
- [x] Publish the WhiteRabbit foundation.
  - Acceptance: public GitHub repository, correct author, AGPL licence, CI, documentation, clean working tree, initial release.
  - Verify: local tests, strict memory validation, successful GitHub Actions run `31695302196`, and release `v0.1.0-foundation`.

## Phase 1: Legal and Threat Boundaries

- [x] Fix the synthetic Defence pilot and client architecture.
  - Historical acceptance: the dual-client boundary was documented in ADR-0006 and
    later superseded by ADR-0008. The current accepted architecture is one PWA with
    Supabase Auth and separate node identity.
  - Verify: Spec 0005, ADR-0008, Architecture 0002 and Plan 0003 are active.

- [ ] Write the Belgian deployment and data-governance specification.
  - Progress: Spec 0001 and ADR-0004 are owner-approved for synthetic implementation planning with five controller profiles; institutional review remains open.
  - Acceptance: the first Defence pilot purpose and accountable service are selected; controller/processor roles, legal basis, camera procedure, classification, hosting, retention, data-subject rights, public-record criteria, and DPIA gate are approved. Municipality and police remain separate reference profiles.
  - Verify: review by the project owner and qualified Belgian public-sector privacy/legal stakeholders.
- [ ] Approve the tenant-scoped biometric-watchlist specification.
  - Progress: Spec 0002 and ADR-0005 are owner-approved for synthetic implementation planning; no biometric dependency or real processing is authorized.
  - Acceptance: the owner selects the first synthetic mode; controller, DPO, legal, security, fundamental-rights, model-risk, and operational reviewers approve capability, purpose, watchlist authority, data flow, human response, retention, rights, and hosting gates.
  - Verify: signed review record linked without sensitive operational details.
- [x] Write a repository-grounded threat model for the synthetic slice.
  - Acceptance: assets, trust boundaries, attacker capabilities, abuse paths, and mitigations cover nodes, Supabase/Vercel candidates, government data-plane cells, models, watchlists, templates, alerts, reviewers, public map, and federation.
  - Verify: threat model quality checklist passes; every critical/high runtime threat remains an implementation gate with an owner required before release.
- [x] Define the versioned signed-event and application API contract.
  - Acceptance: deployment, controller profile, biometric mode, authority, purpose, policy/model version, classification, candidate, restricted, biometric-alert, review, authorized-public, retracted, and expired states are machine-readable and privacy-safe.
  - Verify: Spec 0004 defines canonical signatures, request proofs, replay/idempotency/concurrency handling, distinct payloads, state transitions, routes, errors, and the required schema/abuse test matrix; executable tests follow in implementation.
- [x] Define institutional gates and the phased synthetic implementation plan.
  - Acceptance: controller-profile routing, provenance, legal/DPIA/FRIA, hosting/security, model/device, human-pilot and expansion gates are explicit; implementation has dependency batches, ordered phases, tests, acceptance, stop conditions, memory and push rules.
  - Verify: Compliance 0001 and Plan 0001 are linked from README and memory; tests and strict validation pass.
- [x] Approve the interactive product prototype before implementation.
  - Progress: the dependency-free mobile field flow and desktop command center were approved with a required light-only revision; synthetic implementation and D1 are authorized.
  - Acceptance: the owner can click through mobile sign-in, enrollment, sentry, alert review, and audit receipt plus desktop overview, operations, candidate, watchlist, node, policy, and audit workflows; both surfaces visibly enforce prototype, classification, tenant, provenance, and human-review boundaries.
  - Verify: responsive Playwright walkthroughs, visual inspection, keyboard/focus review, no browser-console errors, and explicit owner approval.

- [ ] Complete P1 workspace and quality gates.
  - Progress: pinned pnpm/Node tooling, TypeScript quality bases, shared tokens,
    Next.js PWA production builds, peer checks and CI are implemented. Expo and its
    parser finding were removed. A dependency-free repository secret scanner plus
    reviewed-licence and CycloneDX 1.6 validators are test-green and wired into CI.
    Tag releases attach the SBOM and checksum; remote CI confirmation is pending.
  - Acceptance: add repository-wide secret scanning plus durable licence/SBOM checks;
    preserve zero unaccepted critical/high runtime findings.
  - Verify: frozen install, peer check, format, lint, typecheck, tests, builds, audit,
    SBOM/licence/secret checks and strict memory validation pass in GitHub Actions.

## Phase 2: Single-PWA Vertical Slice

- [ ] Build the real-data-ready product behind typed contracts and fail-closed ports.
  - Progress: Plan 0003 is active; Expo is removed; the installable PWA shell and
    executable account/policy contracts, guarded Supabase client and real-provider
    Auth services are implemented. Public and account routes contain no runtime mock
    records. Camera/node/install/settings readiness and the exact Supabase handoff
    runbook are complete. The baseline signed-event header/signature schema is now
    executable and rejects biometric/unknown types plus undeclared fields. Minimized
    ALPR/object envelopes now reject raw plates and identifying person fields. The
    baseline candidate projection, human-review input and exact state transitions are
    executable; persistence is still absent. Configuration remains optional until the
    owner creates a project.
  - Acceptance: public/account/setup/product routes contain no invented operational
    records; real Supabase Auth activates without UI changes; policy and camera
    lifecycle contracts deny unavailable capabilities explicitly.
  - Verify: contract/policy tests, browser walkthroughs, production PWA build and
    automatic Vercel deployment from `main`.

- [ ] Enroll one browser camera node into one authorized deployment.
  - Progress: explicit browser permission, local preview state, track cleanup,
    foreground-only interruption, post-permission real-device selection, session-only
    capture-zone acknowledgement, readiness diagnostics, strict enrollment schemas and
    a guarded provider service are implemented; persistence, claim completion proof and
    node identity wait for Supabase RLS.
  - Acceptance: revocable node identity, explicit camera permission, approved capture
    zone and foreground-only lifecycle; enrollment persistence waits for Supabase RLS.
  - Verify: browser camera lifecycle tests and signed enrollment contract test.
- [ ] Detect vehicles locally without uploading video.
  - Acceptance: only minimal candidate metadata and permitted redacted evidence cross the boundary.
  - Verify: network inspection proves no raw stream or full frame is transmitted.
- [ ] Review one confirmed synthetic government-vehicle candidate.
  - Acceptance: corroborated evidence, human confirmation, profile authorization, audit record, retraction/expiry path, and no public projection in the Defence pilot.
  - Verify: end-to-end synthetic fixture.

## Phase 3: Operational Hardening

- [ ] Implement retention and deletion enforcement.
- [ ] Add privacy masks, redaction proof, audit exports, and data-subject workflows.
- [ ] Package a desktop node for USB and IP cameras.
- [ ] Run a synthetic pilot before any real-world footage is processed.

## Phase 3B: Synthetic Biometric Vertical Slice

- [ ] Implement fail-closed biometric authority and watchlist-package contracts test-first.
  - Acceptance: expired, revoked, cross-tenant, wrong-purpose, wrong-node, and wrong-model packages cannot execute embedding or matching.
  - Verify: table-driven contract and abuse-case tests.
- [ ] Benchmark permissively licensed face detection and embedding on an approved iPhone tier.
  - Acceptance: reproducible latency, throughput, memory, battery, thermal, camera-recovery, FPIR/FNIR, model digest, and licence report using synthetic or explicitly consented evaluation data.
  - Verify: signed evaluation artifact; no network request contains a frame, crop, non-match embedding, or real identity.
- [ ] Raise and review one synthetic biometric candidate alert.
  - Acceptance: local temporal corroboration, signed candidate, human review, deny/revoke/expire path, and no public projection.
  - Verify: synthetic end-to-end test and cross-tenant negative test.

## Phase 4: Collaboration and Federation

- [ ] Add invite-only circles with least-privilege roles.
- [ ] Add prospective, scoped, expiring bridges without historical auto-merge.
- [ ] Prove isolation across Defence, police, municipal, and public-projection fixtures.
- [ ] Add federation only after contract, revocation, provenance, and abuse controls are proven.

## Research Backlog

- Non-identifying people counts and flow statistics.
- Hazards, abandoned objects, road obstructions, public assets, and incident context.
- Government fleet categories and public-source corroboration.
- Persistent person identification or cross-camera re-identification remains out of scope pending a separately approved legal and technical specification.
