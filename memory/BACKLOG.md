# Backlog

Tasks are ordered by dependency. A task is not complete until its verification succeeds and durable memory is updated.

## Phase 0: Durable Foundation

- [x] Clone and inspect SparrowMap without modifying upstream.
  - Acceptance: clean checkout, licence and architecture identified.
  - Verify: `git -C sparrowmap status --short --branch`
- [x] Implement memory validation and lifecycle hooks test-first.
  - Acceptance: startup context is bounded; stale memory triggers one repair turn; secrets and broken links fail validation.
  - Verify: `python3 -m unittest discover -s tests -v`
- [ ] Publish the WhiteRabbit foundation.
  - Acceptance: public GitHub repository, correct author, AGPL licence, CI, documentation, clean working tree, initial release.
  - Verify: local tests, strict memory validation, GitHub Actions, release URL.

## Phase 1: Legal and Threat Boundaries

- [ ] Write the Belgian deployment and data-governance specification.
  - Acceptance: controller/processor roles, legal basis, purposes, camera-law obligations, retention, data-subject rights, public-record criteria, and DPIA gate are explicit.
  - Verify: review by the project owner and qualified Belgian public-sector privacy/legal stakeholders.
- [ ] Write a repository-grounded threat model.
  - Acceptance: assets, trust boundaries, attacker capabilities, abuse paths, and mitigations cover nodes, Supabase, Vercel, reviewers, public map, and federation.
  - Verify: security review with no unresolved critical risk.
- [ ] Define the versioned signed-event contract.
  - Acceptance: candidate, private, review, confirmed-public, retracted, and expired states are machine-readable and privacy-safe.
  - Verify: schema tests and abuse-case fixtures.

## Phase 2: Single-Node Vertical Slice

- [ ] Enroll one browser camera into one authorized deployment.
  - Acceptance: revocable node identity, explicit camera permission, approved capture zone, offline status.
  - Verify: browser integration test and signed enrollment test.
- [ ] Detect vehicles locally without uploading video.
  - Acceptance: only minimal candidate metadata and permitted redacted evidence cross the boundary.
  - Verify: network inspection proves no raw stream or full frame is transmitted.
- [ ] Review and publish one confirmed government-vehicle event.
  - Acceptance: corroborated evidence, human confirmation, audit record, retraction path, public map marker.
  - Verify: end-to-end synthetic fixture.

## Phase 3: Operational Hardening

- [ ] Implement retention and deletion enforcement.
- [ ] Add privacy masks, redaction proof, audit exports, and data-subject workflows.
- [ ] Package a desktop node for USB and IP cameras.
- [ ] Run a synthetic pilot before any real-world footage is processed.

## Phase 4: Collaboration and Federation

- [ ] Add invite-only circles with least-privilege roles.
- [ ] Add prospective, scoped, expiring bridges without historical auto-merge.
- [ ] Add federation only after contract, revocation, provenance, and abuse controls are proven.

## Research Backlog

- Non-identifying people counts and flow statistics.
- Hazards, abandoned objects, road obstructions, public assets, and incident context.
- Government fleet categories and public-source corroboration.
- Persistent person identification or cross-camera re-identification remains out of scope pending a separately approved legal and technical specification.
