# Compliance 0001: Review and Release Gates

- Status: required governance workflow
- Date: 2026-08-13
- Applies to: every WhiteRabbit controller profile and deployment

## Purpose

This document turns legal, fundamental-rights, security, model, provider, and
operational review into explicit engineering gates. It is not legal advice and does
not determine which regime applies. The accountable controller and qualified Belgian
counsel must map each exact purpose before real data is processed.

Open-source availability, repository ownership, a government customer, technical
feasibility, or successful synthetic tests do not satisfy any real-use gate.

## Governance Roles

| Role | Accountable decision |
| --- | --- |
| Product owner | Product scope, repository direction, and synthetic implementation authorization |
| Controller service owner | Exact statutory/public task, purpose, necessity, users, locations, recipients, and operational response |
| Controller DPO | Applicable data-protection regime, DPIA, rights, notices, retention, consultation, and processor controls |
| Qualified legal counsel | National/EU legal basis, camera/biometric/AI rules, authority and authorization procedure |
| Security/accreditation authority | Classification, topology, identity, key management, logging, incident response, build/distribution and residual cyber risk |
| Fundamental-rights reviewer | Necessity, proportionality, affected groups, safeguards, remedies and FRIA where applicable |
| Model-risk/AI authority | Intended use, model/weight/data provenance, licence, evaluation, thresholds, bias, drift and change control |
| Operational owner | Capture zone, mounting, staff training, review procedure, escalation, health monitoring and physical controls |
| Procurement/processor owner | Controller-processor terms, subprocessors, regions, support, telemetry, deletion, exit and audit rights |
| Independent/supervisory authority | Advice, prior consultation, authorization or oversight where the applicable regime requires it |

One person may not approve both sides of a maker-checker action. The DPO and security/
fundamental-rights reviewers must be able to challenge the service owner independently.

## Regime Routing

### Defence administration

`BE-DEFENCE-ADMIN` starts from an administrative, non-classified purpose only. The
controller must confirm whether the GDPR, Belgian Act of 30 July 2018, Camera Act,
sensitive-site rules, sector rules, employment rules, or another basis applies. The
Ministry of Defence publicly identifies itself as a controller for its published
processing and provides a Defence DPO contact, but that statement is not itself a
legal basis for WhiteRabbit.

### Armed-forces operations, intelligence, or national security

`BE-ARMED-FORCES-OPS` and `BE-INTEL` require a separate applicability analysis because
national-security and operational activities may fall under different Belgian and
EU scopes. Do not assume either a GDPR/AI Act obligation or an exemption without a
written controller/counsel determination. They are not variants of the managed public
SaaS topology.

### Police

`BE-POLICE` routes through the competent police legal and oversight framework. The
Belgian Supervisory Body for Police Information (COC) states that police camera use is
governed by the Police Function Act and that it supervises police information and
data protection, including Title II of the Act of 30 July 2018 for operational tasks.
COC advice, notification, prior consultation, database, DPO, breach, and camera
procedures must be mapped for the selected use. A Defence approval cannot be reused.

### Municipality or other public authority

`BE-MUNICIPAL` requires its own controller mandate, public-space/camera procedure,
GDPR/Belgian-law analysis, DPO/DPIA decision, notices/register, retention, access,
rights, procurement, and data-sharing approval. It has no biometric mode by default.

## Gate G0 — Product and Synthetic Scope

Status for Spec 0003: **passed for planning; implementation authorization pending**.

Required evidence:

- owner-approved controller profile, fictional purpose, data nature and non-goals;
- synthetic fixture policy and repository/publication boundaries;
- explicit ALPR, object and biometric mode matrix;
- no public projection, federation, real identity, footage, location or plate;
- pilot retention and deletion rule;
- architecture, UX, API contract and repository threat model.

Exit decision: the product owner may authorize synthetic code and approved development
dependencies. G0 never authorizes cloud provisioning, model weights, or real data.

## Gate G1 — Source, Dependency and Model Provenance

Required before any production dependency, native module, model, weight or dataset is
committed:

- exact package/artifact name, version, digest and upstream;
- source, binary, weight, dataset and transitive licence review as separate items;
- AGPL compatibility and corresponding-source obligations;
- vulnerability/advisory posture, maintainer health and supported platforms;
- SBOM/provenance plan, lockfile, update owner and end-of-life path;
- model card, intended/prohibited use, training-data evidence, evaluation lineage and
  export/distribution constraints;
- explicit product-owner plus legal/security/model-risk approval for biometric items.

Exit evidence is a repository decision record with no embedded model bytes, private
legal advice, credentials, or sensitive procurement terms.

## Gate G2 — Controller, Purpose and Lawful Authority

Required before any real plate, image, face, route, person, vehicle or camera feed:

- named controller service and accountable owner;
- controller/processor/joint-controller allocation;
- exact statutory/public task and legal basis per processing operation;
- purpose, necessity, proportionality, geographic/temporal scope and alternatives;
- data categories, subject/watchlist categories, recipients and prohibited uses;
- camera visibility, notice/register/authorization procedure and capture-zone plan;
- data-subject information, access/correction/deletion/restriction/complaint path;
- retention schedule per raw/local/event/evidence/template/audit/backup domain;
- police COC or other competent authority route where applicable.

The approval is versioned and signed. Missing or expired authority maps to a stable
technical deny reason.

## Gate G3 — DPIA, FRIA and AI-System Classification

Required before real biometric or systematic monitoring:

- applicable GDPR, Law Enforcement Directive/Belgian Title II, sector, Defence,
  national-security and AI Act scope determination;
- DPIA or equivalent high-risk assessment with data-flow and threat model;
- fundamental-rights impact assessment where required or adopted as a safeguard;
- AI Act prohibited-practice/high-risk/deployer/registration/authorization analysis,
  including the narrow real-time remote biometric rules where relevant;
- affected groups, representative conditions, false-positive/negative harm, bias,
  accessibility, worker/visitor/bystander impact and remedies;
- prior consultation or independent/judicial/administrative authorization when the
  applicable rules require it;
- residual-risk acceptance signed by accountable—not merely technical—owners.

No software setting may treat G3 as a self-service checkbox.

## Gate G4 — Security, Classification and Hosting Accreditation

Required before any non-synthetic deployment or provider connection:

- approved data-classification matrix and system/security architecture;
- tenant/cell topology, network exposure, regions, encryption and key custody;
- human and node identity, MFA/SSO roadmap, device security floor, MDM/attestation,
  enrollment, recovery, revocation and break-glass procedure;
- RLS/application authorization evidence and cross-tenant negative tests;
- secure build, code signing, distribution, SBOM, vulnerability response and rollback;
- log/telemetry/support/backup/subprocessor inventory and data-flow approval;
- retention/deletion, restore, incident, breach, evidence-preservation and continuity
  tests;
- threat-model critical/high mitigation ownership and residual-risk sign-off;
- accredited/self-hosted provider decision for restricted/operational/classified data.

Vercel or managed Supabase approval for synthetic fixtures does not transfer to real
or higher-classification data.

## Gate G5 — Model and Device Operational Validation

Required per exact model, threshold, package, device class, OS and capture environment:

- signed artifact digests and compatible model/watchlist versions;
- representative FPIR/FNIR, precision/recall and confidence intervals appropriate to
  each ALPR/object/biometric decision;
- performance and disparity evaluation across relevant, lawfully evaluated groups and
  conditions, with a documented unsafe/no-deploy result path;
- presentation-attack, adversarial, poor-light, pose, occlusion, screen/print,
  lookalike, mask, weather, glare and motion testing as applicable;
- sustained latency, throughput, memory, battery, thermal, storage, network, camera
  recovery, offline queue and degraded/stop behavior on every supported device tier;
- calibrated thresholds in signed policy, not UI code;
- drift, expiry, monitoring, reevaluation and rollback criteria.

Synthetic success is evidence about engineering behavior, not proof of real-world
accuracy or fairness.

## Gate G6 — Human Procedure and Limited Real Pilot

Required before a time-boxed real pilot:

- trained named roles and least privilege;
- mounting/aiming/capture-mask and daily readiness checklist;
- clear candidate—not identity—review script and uncertainty display;
- prohibition on automatic adverse action plus separate authority for any response;
- second-review/escalation criteria, incident reporting, correction and remedy;
- reviewer workload/fatigue limits and quality sampling;
- visible stop, emergency revoke, data freeze/delete and public takedown procedures;
- participant/bystander/worker information and complaint handling where applicable;
- start/end date, node/site/subject/watchlist cap, success/stop criteria and daily
  owner review;
- pre-pilot tabletop and rollback exercise.

Exit decision authorizes only the signed, bounded pilot. It does not authorize scale,
new sites, new recipients, new models, longer retention, public output or federation.

## Gate G7 — Scale, Publication or Federation Change

Any new controller, profile, real-time mode, watchlist category, site, node class,
model, threshold, data source, public output, circle, bridge, recipient, retention,
provider or operational response reopens proportional gates. Public projection needs
its own allowlisted schema, purpose, delay/coarsening/suppression, review, takedown and
security assessment. Biometric projection or cross-tenant biometric search remains
prohibited.

## Gate Record Template

```text
Gate:
Deployment and controller profile:
Purpose and data classification:
Scope/version/digests:
Required reviewers:
Evidence references:
Open critical/high findings:
Conditions and expiry:
Decision: approved | approved-with-conditions | rejected | expired
Signatures/date:
```

Public repository records contain only non-sensitive decision summaries and digests.
Detailed legal, security, operational, watchlist, site and procurement records remain
in the controller's approved system of record.

## Authoritative Starting Points

- EU AI Act, Regulation (EU) 2024/1689: https://eur-lex.europa.eu/eli/reg/2024/1689/oj?locale=en
- GDPR, Regulation (EU) 2016/679: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- Law Enforcement Directive (EU) 2016/680: https://eur-lex.europa.eu/eli/dir/2016/680/oj/eng
- Belgian Act of 30 July 2018: https://etaamb.openjustice.be/nl/wet-van-30-juli-2018_n2018040581.html
- Belgian DPA camera guidance: https://dataprotectionauthority.be/burger/thema-s/camera-s-en-uw-privacy/bewakingscamera-s
- Belgian DPA DPIA prior-consultation guide: https://www.dataprotectionauthority.be/publications/handleiding-voorafgaande-raadpleging-dpia.pdf
- Belgian Police Information Supervisory Body: https://www.controleorgaan.be/en/
- COC police camera guidance: https://www.controleorgaan.be/nl/politiediensten/camerawetgeving
- Belgian Defence privacy/DPO information: https://www.mil.be/en/privacy/

These sources are a review starting point. The controller must verify the current
consolidated law, competent authority, transitional dates, national implementation,
case law, guidance and exact applicability when each gate is assessed.
