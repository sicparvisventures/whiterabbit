# Risk Register

This register is engineering context, not legal advice. Production deployment requires review by the responsible Belgian public authority, its data-protection officer, and qualified counsel.

## R-001: Missing or Inadequate Legal Authority

- Severity: Critical
- Risk: Building “for the Belgian state” does not itself create a legal basis, controller mandate, or authority to monitor public space.
- Mitigation: block real deployment until controller identity, statutory task, purpose, perimeter, camera-law procedure, DPIA, notices, register, retention, and rights process are approved.
- Evidence: the Belgian Data Protection Authority states that a controller for a non-enclosed public place can only be a public authority and describes proportionality, notification, pictogram, register, and access-control duties.
- Source: https://dataprotectionauthority.be/burger/thema-s/camera-s-en-uw-privacy/bewakingscamera-s

## R-002: False Government-Vehicle Classification

- Severity: Critical
- Risk: A civilian plate or journey is published because OCR or classification is wrong.
- Mitigation: conservative threshold, independent corroboration, provenance, human review, delayed publication, appeal and retraction, measured calibration by deployment region.
- Release gate: no single automated signal can publish.

## R-003: Public Location History Enables Harm

- Severity: High
- Risk: Even government-vehicle history may expose sensitive operations, protected people, investigations, or predictable routines.
- Mitigation: public output off by default; profile-specific publication policy; military, police, investigative, and protected categories suppressed unless expressly authorized; delay/coarsen where required; incident review; emergency takedown; public audit of policy changes.

## R-004: Civilian or Person Tracking Creep

- Severity: Critical
- Risk: General OSINT features evolve into public civilian-plate lookup, facial recognition, or persistent cross-camera person tracking.
- Mitigation: schema-level public/private separation, no central civilian plate text, no face embeddings, feature gates, ADR and DPIA requirements, RLS isolation, audit logs, abuse testing.

## R-005: Exact Camera Locations Expose Operators

- Severity: High
- Risk: A public map or database leak identifies camera hosts, homes, blind spots, or node tokens.
- Mitigation: never publish true node coordinates; publish approved coverage geometry or jittered locations; store credentials separately; signed events; revocation; short-lived tokens.

## R-006: Cloud Compromise

- Severity: High
- Risk: Supabase, Vercel, an operator account, or a service key exposes events or evidence.
- Mitigation: Supabase/Vercel only for formally approved classifications and profiles; provider boundary for accredited or self-hosted infrastructure; least-privilege RLS, separate public projection, no service-role key in clients, encrypted storage, short retention, audit trails, secret scanning, incident and key-rotation procedures.

## R-007: Edge Device Reliability and Capture Abuse

- Severity: Medium
- Risk: old phones sleep, overheat, lose permission, upload duplicate events, or are aimed outside the authorized zone.
- Mitigation: foreground-only status, wake-lock monitoring, heartbeat/offline events, signed sequence numbers, capture masks, periodic re-attestation, visible compliance checklist.

## R-008: Open-Source and Model Licence Violations

- Severity: High
- Risk: reused SparrowMap or model code is published without AGPL source availability, notices, or corresponding-source obligations.
- Mitigation: AGPL-3.0 repository, `NOTICE.md`, preserved headers, dependency licence inventory, source offer in the network UI, release provenance.

## R-009: Memory Automation Publishes Sensitive Context

- Severity: High
- Risk: raw chats, credentials, footage references, or private operational details are committed automatically.
- Mitigation: never store raw transcripts; managed-memory secret scan; explicit staging; no blind hook-based git push; strict validation before atomic publication.

## R-010: Controller and Regime Conflation

- Severity: Critical
- Risk: Defence, armed-forces operations, intelligence, police, and municipal records are pooled or processed under an inapplicable legal basis, oversight path, or rights procedure.
- Mitigation: immutable fail-closed controller profiles; one controller per deployment; no relabeling of history; explicit two-sided bridges; separate oversight and data-subject procedures; cross-profile isolation tests.
- Release gate: no real-data deployment until the accountable controller and applicable profile are formally approved.

## R-011: Classified or Operational Data Reaches Public Cloud or Source

- Severity: Critical
- Risk: military-operational, intelligence, police-investigation, or classified details enter Vercel, managed Supabase, logs, telemetry, support systems, Git history, or a public projection.
- Mitigation: synthetic/non-classified first pilot; data-classification field and fail-closed policy; profile-specific hosting accreditation; public-cloud deny rule for restricted profiles; no operational configuration or data in the public repository.
- Release gate: approved data-flow diagram, classification decision, hosting authority, logging inventory, incident plan, and negative exfiltration tests.

## R-012: False Biometric Identification

- Severity: Critical
- Risk: poor lighting, pose, occlusion, demographic performance differences, model drift, threshold errors, or a similar-looking person generates a false watchlist alert and harmful intervention.
- Mitigation: deployment-representative FPIR/FNIR calibration with confidence intervals; quality gates; temporal corroboration; trained two-person review where required; clear uncertainty; no autonomous adverse action; correction and incident paths.
- Release gate: controller-approved operating point and subgroup evaluation with no unresolved critical disparity or unsafe workflow.

## R-013: Unlawful Watchlist or Mass Surveillance

- Severity: Critical
- Risk: public/OSINT photos, CCTV, broad subject categories, excessive locations, or expired cases silently become a persistent face database or untargeted tracking system.
- Mitigation: prohibit untargeted scraping; signed purpose/site/time authority; lawful provenance; maker-checker enrollment; permitted-category allowlist; automatic expiry; immutable audit; no global search or history merge.
- Release gate: approved legal basis, DPIA/FRIA, watchlist policy, independent oversight path, and red-team abuse test.

## R-014: Irrevocable Biometric Breach

- Severity: Critical
- Risk: reference images or embeddings leak across tenants, providers, devices, backups, logs, or support tooling; unlike passwords, faces cannot be replaced.
- Mitigation: minimal edge packages; authority-specific data-plane cells and keys; no biometric public route; encrypted storage and transport; device revocation; short retention; no templates in logs; tested deletion and breach response.
- Release gate: key/data-flow review and cross-tenant, backup, log, export, and deletion tests.

## R-015: Model Licence, Lineage, Bias, and Drift

- Severity: Critical
- Risk: permissive repository code hides restricted pretrained weights or training data; an unversioned model change invalidates embeddings, thresholds, or fairness evidence.
- Mitigation: model registry with digest, code/weight/data licences, lineage, intended use, evaluation, approval and expiry; forbid InsightFace community weights without production rights; block mixed model versions; re-evaluate every artifact change.
- Release gate: legal and model-risk approval for every exact artifact in the build.

## R-016: Mobile Capture Failure and Spoofing

- Severity: High
- Risk: iOS releases the camera when the Expo app backgrounds, an old device overheats, a printed/photo-screen face spoofs a match, or a compromised node forges alerts.
- Mitigation: explicit foreground `Sentry Mode`; visible health, power, and thermal state; signed monotonic events; device attestation where approved; capture recovery tests; presentation-attack testing; multi-observation corroboration; supported-device policy.
- Release gate: sustained tests on every supported iPhone tier and no claim of background operation without native proof.
