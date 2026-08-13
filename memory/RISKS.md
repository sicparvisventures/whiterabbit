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
- Mitigation: purpose-specific publication policy, delayed/coarsened locations where required, sensitive-category suppression, incident review, emergency takedown, legal exemptions, public audit of policy changes.

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
- Mitigation: least-privilege RLS, separate public projection, no service-role key in clients, encrypted storage, short retention, audit trails, secret scanning, incident and key-rotation procedures.

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
