# Specification 0001: Belgian Controller Profiles

- Status: draft for owner, DPO, legal, security, and operational review
- Date: 2026-08-13
- Product language: English
- Initial market: Belgium

## Objective

Build one open-source WhiteRabbit core that can support legally authorized Belgian
public-sector deployments without treating "the Belgian state" as one controller
or one data-sharing boundary. Belgian Defence is the first intended adopter;
municipalities and police must be supported through separate policy profiles.

The first executable pilot is deliberately narrower: one controller, one approved
site and purpose, synthetic or otherwise explicitly approved non-classified data,
one edge camera, and no automatic public disclosure.

## Confirmed Product Direction

- WhiteRabbit is controller-agnostic; Belgian Defence is the first deployment,
  not a hardcoded product owner or universal data controller.
- A deployment has exactly one accountable controller profile.
- Circles can collaborate inside a deployment. Bridges can exchange explicitly
  permitted records between deployments, but never merge controllers or histories.
- Raw video and primary inference remain on the edge by default.
- Public output is a separately generated projection, never a view over operational
  tables.
- Military, police, investigation-linked, protected-person, and other sensitive
  movements are restricted by default. Publication requires a profile-specific,
  documented approval and must be delayed, coarsened, or suppressed when needed.
- Facial recognition, person identification, and cross-camera person tracking are
  outside this specification.

## Controller Profiles

### `BE-DEFENCE-ADMIN` — first pilot

For non-classified Belgian Defence administrative security use, such as an approved
base entrance, perimeter, or own-fleet workflow. Belgian Defence/FOD Defence is the
intended controller, subject to formal confirmation for the selected purpose.

The pilot uses synthetic data until the controller has approved the exact purpose,
capture zone, legal basis, DPIA, notices, retention, recipients, hosting, security
accreditation, and data-subject procedure. Public military-vehicle history is off.

### `BE-ARMED-FORCES-OPS`

For processing necessary for the deployment and readiness of the armed forces.
This is not a configuration switch on the public SaaS. It requires a separately
accredited topology, mission-specific necessity and proportionality, restricted
operators, and explicit oversight and retention rules.

### `BE-INTEL`

For statutory intelligence and security missions, including an ADIV/GISS context.
It is isolated from public SaaS and public projections and requires its own legal,
classification, infrastructure, audit, and oversight design. No implementation is
authorized by this draft.

### `BE-POLICE`

For an accountable entity in the integrated police. Police camera processing is
governed by the Police Function Act rather than being treated as an ordinary Camera
Act deployment. Oversight and data-subject procedures must account for the COC.
Police records are not shared with a municipal or Defence deployment by default.

### `BE-MUNICIPAL`

For a Belgian municipality or other competent public authority using cameras for
an approved local purpose. It requires a documented public-space authority, GDPR
and Camera Act analysis, required advice or decisions, notices, camera register,
access controls, retention, and data-subject handling.

## Architecture and Data Boundaries

WhiteRabbit has three planes:

1. **Edge plane:** camera capture, masks, inference, short-lived local evidence,
   node identity, and signed event creation.
2. **Restricted operational plane:** minimally necessary events, review material,
   policy decisions, retention enforcement, and append-only audit evidence.
3. **Public projection plane:** a separately materialized, revocable, provenance-
   carrying output containing only records permitted by the active profile.

Every deployment record carries immutable `deployment_id`, `controller_profile`,
`purpose_id`, `policy_version`, and data classification. A policy decision must
authorize every transition between planes. Changing profile creates a new
deployment; it never relabels existing history.

A bridge is an explicit protocol with sender and recipient approval, purpose,
allowed schema, legal basis, direction, start and expiry, retention, audit, and
revocation. It is prospective by default. There is no generic "merge groups"
operation at the data layer.

## Technical Stack and Hosting

- TypeScript for shared contracts and policy-safe application code.
- A React/Next.js web interface suitable for Vercel where the deployment profile
  permits it.
- PostgreSQL-compatible storage behind a provider boundary; Supabase is a candidate
  for development and approved non-sensitive deployments, not a universal mandate.
- RLS or an equivalent policy layer, separate restricted and public schemas, signed
  event envelopes, encrypted object storage, and append-only security audit records.
- A browser-first edge node, followed by a packaged node for old laptops, phones,
  USB cameras, and approved IP cameras.
- Self-hosted or government-accredited infrastructure adapters for profiles whose
  classification, sovereignty, availability, or accreditation rules exclude the
  public Vercel/Supabase topology.

No cloud project, production dependency, or real-data pipeline is authorized by
this draft.

## Initial Interface Shape

The precise event schema follows in a separate versioned contract. The policy
boundary must support this minimum shape:

```ts
type ControllerProfile =
  | "BE-DEFENCE-ADMIN"
  | "BE-ARMED-FORCES-OPS"
  | "BE-INTEL"
  | "BE-POLICE"
  | "BE-MUNICIPAL";

type PolicyContext = {
  deploymentId: string;
  controllerProfile: ControllerProfile;
  purposeId: string;
  policyVersion: string;
  classification: "public" | "official" | "restricted" | "classified";
};
```

Invalid or unknown profile, purpose, policy version, or classification values fail
closed. Operational code must not branch on an informal organization name.

## Project Structure

The anticipated implementation is organized by trust boundary, not customer:

```text
apps/web/             operator and permitted public interfaces
apps/edge-web/        browser camera node
packages/contracts/   versioned event and policy contracts
packages/policy/      pure fail-closed policy decisions
packages/adapters/    storage, identity, hosting, and deployment adapters
supabase/             approved schema and local-development configuration
docs/specs/           reviewable product and legal-boundary specifications
memory/decisions/     immutable architecture decisions
```

## Code and Documentation Style

- English identifiers, product copy, specifications, and commit messages.
- Small pure policy functions with explicit inputs and typed outcomes.
- No controller-specific condition hidden in UI code or storage queries.
- Deny by default; include a stable reason code in every denial.
- Never log raw frames, full plate text, biometrics, secrets, or private coordinates.
- Cite authoritative Belgian sources for legal-boundary claims and mark legal review
  status; source code comments do not substitute for controller approval.

## Testing Strategy

- Contract tests reject unknown profiles, purposes, classifications, and versions.
- Table-driven policy tests cover every profile and every plane transition.
- Negative tests prove that records cannot cross deployments or become public by
  default.
- RLS/integration tests use two controllers and attempt cross-tenant access.
- Edge network tests prove that raw streams and full frames are not uploaded.
- Retention tests use a controllable clock and verify deletion plus audit evidence.
- Synthetic end-to-end fixtures cover enrollment, detection, review, suppression,
  publication where permitted, retraction, and bridge revocation.
- Threat-model and DPIA gates precede any real-world footage test.

## Operating Boundaries

### Always

- Require an identified controller, statutory/public task, explicit purpose,
  approved capture zone, data categories, recipients, retention, rights procedure,
  and accountable policy version.
- Minimize on the edge and keep raw video local by default.
- Keep deployments and controller profiles cryptographically and logically isolated.
- Use synthetic data until the relevant controller approves real-data processing.
- Preserve provenance, human accountability, auditability, retraction, and expiry.

### Ask for Formal Approval

- Processing real plates, people, operational routes, or unredacted evidence.
- Provisioning cloud or government infrastructure.
- Enabling any public projection, inter-controller bridge, or historical import.
- Adding a new purpose, data category, model, retention period, or recipient.
- Moving from `BE-DEFENCE-ADMIN` to operations or intelligence use.

### Never Under This Specification

- Treat all Belgian authorities as one controller or silently pool their records.
- Put classified, military-operational, intelligence, or police-investigation data
  in the public SaaS or repository.
- Publish live or precise military/police movement history by default.
- Persist centrally searchable civilian plate histories.
- Add face recognition, person identification, or cross-camera re-identification.
- Infer surveillance authority from repository ownership or open-source licensing.

## Success Criteria for Phase 1 Approval

- Product owner accepts the five-profile model and the Defence-first pilot boundary.
- The first controller names the exact pilot purpose and accountable service.
- Controller and processor roles are documented for every selected provider.
- Qualified Belgian public-sector legal/privacy reviewers approve the applicable
  legal basis, camera procedure, DPIA need, notices, rights, retention, and sharing.
- Security reviewers approve the classification and hosting topology.
- Public-record criteria explicitly enumerate included and suppressed fleet classes.
- A repository-grounded threat model has no unresolved critical risk.
- Only then may implementation of the signed-event contract and synthetic vertical
  slice begin.

## Open Decisions Requiring the First Controller

1. Is the Defence pilot for access control, perimeter awareness, own-fleet logistics,
   or another precisely defined statutory task?
2. Which Defence service is controller, and which parties are processors or joint
   controllers?
3. What classifications, sites, vehicle classes, recipients, retention periods,
   and evidence fields are permitted?
4. Must all services run on accredited Belgian-government infrastructure, or may an
   approved non-sensitive pilot use managed EU-region services?
5. Is any public output required for the Defence pilot? The safe default is no.
6. Which municipality or police use case should become the second reference profile?

## Authoritative References

- Belgian Defence privacy and DPO information: https://www.mil.be/nl/privacy/
- Belgian Act of 30 July 2018 on personal-data protection, including Title 3 regimes:
  https://etaamb.openjustice.be/nl/wet-van-30-juli-2018_n2018040581.html
- Belgian DPA camera guidance, including public authorities, police, and sensitive
  sites: https://dataprotectionauthority.be/burger/thema-s/camera-s-en-uw-privacy/bewakingscamera-s
- Royal Decree of 6 December 2018 concerning immediate perimeters of sensitive sites:
  https://etaamb.openjustice.be/nl/koninklijk-besluit-van-06-december-2018_n2018032534.html
- Belgian DPA overview of competent supervisory authorities:
  https://dataprotectionauthority.be/professioneel/de-autoriteit/andere-autoriteiten

This specification is engineering context, not legal advice or deployment authority.
