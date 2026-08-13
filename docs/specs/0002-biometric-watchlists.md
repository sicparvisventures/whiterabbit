# Specification 0002: Tenant-Scoped Biometric Watchlists

- Status: draft for owner, controller, DPO, legal, COC where applicable, security,
  fundamental-rights, model-risk, and operational review
- Date: 2026-08-13
- Depends on: Specification 0001 and ADR-0004

## Objective

Add optional biometric identification against a narrowly authorized watchlist while
retaining WhiteRabbit's ALPR and non-identifying object-detection capabilities.

The operator can enroll a lawfully acquired reference image under a documented
authority and expiry, distribute a minimal signed watchlist package to approved edge
nodes, detect and align a face locally, create an embedding locally, compare it only
to that package, and raise a candidate alert for trained human review. No match is an
identity determination or operational instruction by itself.

WhiteRabbit remains multi-tenant at government level. “Multi-tenant” means a shared
product and control-plane contract, not a global biometric database. Restricted data
planes may require a separate authority-specific deployment cell or physical instance.

## Capability Model

Biometrics is independent from the controller profile and fails closed:

```ts
type BiometricMode =
  | "DISABLED"
  | "FACE_DETECTION_ONLY"
  | "VERIFICATION_1_TO_1"
  | "POST_IDENTIFICATION_1_TO_N"
  | "REALTIME_IDENTIFICATION_1_TO_N";

type BiometricAuthority = Readonly<{
  deploymentId: string;
  tenantId: string;
  purposeId: string;
  biometricMode: BiometricMode;
  authorityReference: string;
  geographicScope: string;
  validFrom: string;
  validUntil: string;
  watchlistId?: string;
  policyVersion: string;
  modelVersion: string;
}>;
```

An authorization with a missing, expired, unknown, mismatched, or revoked field
denies capture-to-template processing and matching. `FACE_DETECTION_ONLY` may locate
and count a face but cannot create or compare an identity embedding.

## Profile Matrix

| Controller profile | Detection only | 1:1 verification | Post-event 1:N | Real-time 1:N watchlist |
| --- | --- | --- | --- | --- |
| `BE-MUNICIPAL` | Profile approval | Disabled by default | Disabled | Disabled |
| `BE-POLICE` | Profile approval | Separate purpose | Only a targeted, authorized workflow aligned with police/BIS procedure | Blocked pending applicable Belgian rules and case-specific authorization |
| `BE-DEFENCE-ADMIN` | First synthetic pilot option | Candidate for controlled access after approval | Separate approval | Synthetic only; real use requires a separate approved purpose and topology |
| `BE-ARMED-FORCES-OPS` | Separate deployment | Separate deployment | Separate deployment | Separate exclusively military/defence assessment and accredited deployment |
| `BE-INTEL` | Separate classified design | Separate classified design | Separate classified design | Not implemented by this specification |

The product may expose unavailable capabilities in an informational matrix, but must
not provide a UI control that can override a legal or policy block.

## Watchlist Governance

Every watchlist is tenant-, deployment-, purpose-, model-, place-, and time-scoped.
Every entry requires:

- an opaque subject identifier; no public search key;
- the legally permitted subject category;
- a source and acquisition-provenance record;
- the issuing authority, case or mission reference, and reason code;
- maker-checker approval by two authorized people;
- inclusion, review, and automatic expiry timestamps;
- permitted sites/nodes and alert recipients;
- reference-image quality and model-version metadata;
- correction, suspension, deletion, and emergency-revocation paths.

Reference images may not be scraped indiscriminately from the internet, social media,
or CCTV. A publicly visible photo is not automatically lawful watchlist material.
WhiteRabbit does not create Clearview-style face databases or ingest arbitrary OSINT
face collections.

## Edge Pipeline

The proposed local pipeline is:

```text
camera frame
  -> vehicle/object/face detection
  -> short-lived multi-object tracking
  -> face quality and pose gate
  -> alignment and crop in volatile memory
  -> versioned embedding model
  -> tenant watchlist similarity search
  -> temporal corroboration and calibrated threshold
  -> signed candidate alert
  -> human review and policy-controlled action
```

Frames that fail the quality gate are discarded. The embedding module runs only for
an active biometric authority and only on nodes in scope. Non-matches and bystander
templates are discarded immediately. Default edge mode uploads neither raw video,
full frames, face crops, nor non-match embeddings.

Model versions are not interoperable unless validated as such. A changed embedding
model requires a new watchlist package or a formally validated migration; comparing
vectors from incompatible models is forbidden.

## SaaS and Data-Plane Architecture

- Next.js, React, and TypeScript provide the control plane, review UI, tenant admin,
  and foreground browser edge node.
- Supabase is a candidate for approved non-sensitive control metadata and synthetic
  development. RLS is necessary but not sufficient for high-classification tenants.
- Biometrics use authority-specific data-plane cells: separate encryption keys,
  storage, logs, queues, service identities, backups, and deletion domains.
- Vercel may host a public or approved control-plane shell. Restricted biometric
  evidence, watchlists, embeddings, alerts, and operational APIs do not pass through
  public Vercel services unless the controller expressly accredits that topology.
- Small watchlists are matched locally through a signed, encrypted, minimal package.
  Large watchlists require a separately approved authority-hosted matching service.
- The public projection plane has no route, foreign key, API, or analytics feed to
  biometric subjects, templates, match candidates, or alerts.

## iPhone Operating Model

The first edge implementation is a client-only Next.js route using `getUserMedia`,
a Worker, and an ONNX runtime. The screen stays on and the application remains in the
foreground. It reports camera permission, model readiness, thermal/degraded status,
watchlist version, offline state, and last signed heartbeat.

The provisional browser benchmark uses permissively licensed YuNet detection and
SFace embeddings with synthetic identities. ONNX Runtime Web WASM is the portable
iPhone baseline; any WebGL path is an optional measured optimization. InsightFace
pretrained weights are excluded unless separately licensed.

A pure PWA is not represented as a reliable locked-screen or background sentry. If
an approved device tier cannot sustain the required operating point, a signed native
container or inference adapter may expose the same contracts while the React/TypeScript
UI and policy code remain shared. That change requires a reviewed implementation plan.

## Commands

No biometric dependency is approved yet. The intended command surface after plan
approval is:

```text
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:policy
pnpm test:rls
pnpm test:e2e:synthetic
pnpm benchmark:edge --device-profile iphone
pnpm build
python3 scripts/memory/memory_tool.py validate --strict
```

## Project Structure

```text
apps/web/                     tenant, watchlist, alert, and review UI
apps/edge-web/                foreground browser camera node
packages/contracts/           versioned node, event, and alert envelopes
packages/policy/              controller and biometric capability decisions
packages/edge-inference/      detector, tracker, quality gate, and embedder ports
packages/watchlists/          package verification and local matching
packages/model-registry/      artifact digest, licence, lineage, and approval data
tests/fixtures/synthetic/     generated/non-personal test identities and frames
docs/evaluations/             signed model, device, bias, and threshold reports
```

## Code Style

- English identifiers and UI; explicit discriminated unions; immutable authority
  context; stable denial and alert reason codes.
- Pure policy functions decide whether the biometric stage may execute. UI state,
  camera code, database rows, or feature flags cannot grant authority.
- Match thresholds live in signed, versioned evaluation policies, never magic
  numbers in components.
- Logs use opaque identifiers and never contain face images or embeddings.

```ts
type MatchDecision =
  | { outcome: "NO_CANDIDATE"; reason: "BELOW_CALIBRATED_THRESHOLD" }
  | { outcome: "CANDIDATE"; candidateId: string; requiresHumanReview: true }
  | { outcome: "DENIED"; reason: "AUTHORITY_EXPIRED" | "MODE_NOT_PERMITTED" };
```

## Testing Strategy

- Write policy, contract, and watchlist-package tests before implementation.
- Use synthetic faces and consented, purpose-built evaluation data; never scrape
  public faces for the test suite.
- Test every controller-profile and biometric-mode pair, including all deny paths.
- Attempt cross-tenant, cross-purpose, expired, revoked, replayed, downgraded, and
  model-version-mismatch access.
- Prove through network inspection that edge-local mode sends no video, full frame,
  non-match template, or unapproved crop.
- Calibrate false-positive and false-negative identification rates per camera class,
  environment, watchlist size, and relevant demographic slices using controller-
  approved representative data and confidence intervals.
- Test presentation attacks, poor light, occlusion, masks, twins/lookalikes, printed
  photos, screens, adversarial inputs, threshold manipulation, and reviewer fatigue.
- Run sustained iPhone tests for camera recovery, latency, throughput, memory,
  battery, and thermals. Record exact hardware, OS, browser, model, and runtime.
- Red-team watchlist enrollment, insider misuse, bulk export, alert interception,
  tenant crossover, and public-projection leakage before any real pilot.

## Boundaries

### Always

- Keep ALPR/object events and biometric events as distinct schemas and permissions.
- Require a live, signed authority before producing an embedding.
- Minimize each edge watchlist to the subjects required at that node and time.
- Treat every result as a candidate for trained human review.
- Provide an immediate kill switch, watchlist revocation, expiry, correction, and
  audit path.
- Measure accuracy, bias, and operational performance for the actual deployment.

### Ask for Formal Approval

- Adding any recognition model or weights, even if repository code is permissive.
- Processing a real reference photo, face template, camera feed, or match alert.
- Enabling 1:N identification, exporting an embedding, retaining an alert crop, or
  connecting to another authority's biometric service.
- Changing thresholds, retention, categories, sites, recipients, model version,
  device tier, hosting, or human response procedure.
- Building or enabling a police, operations, intelligence, or public-space pilot.

### Never

- Create or expand a face database through untargeted internet, social-media, or CCTV
  scraping.
- Run a global, cross-tenant, public, or contributor-accessible person search.
- Use ethnicity, race, political opinion, religion, union membership, sex life,
  sexual orientation, emotion, or inferred personality as watchlist attributes.
- Let a score alone identify, detain, deny access, investigate, or otherwise produce
  an adverse decision.
- Store bystander embeddings, non-match face crops, raw video, or precise camera
  locations in the shared SaaS control plane.
- Enable municipal face watchlists or police real-time public-space identification by
  configuration alone.

## Success Criteria

- The owner approves biometrics as an additional isolated capability, not a
  replacement for ALPR/object detection.
- Controller, DPO, legal, security, fundamental-rights, and model-risk reviewers
  approve the exact first biometric mode and purpose.
- The applicable Belgian authority confirms the legal basis, watchlist categories,
  authorization process, oversight, rights, retention, and hosting.
- A threat model and DPIA/FRIA package have no unresolved critical risk.
- Every model artifact has approved licence and provenance documentation.
- Synthetic tests prove fail-closed policy and zero cross-tenant/public leakage.
- A real iPhone benchmark meets a controller-approved operating point. The provisional
  engineering target is two analysed frames per second and a candidate alert within
  three seconds for a local watchlist of at most 1,000 entries, sustained for thirty
  minutes without thermal shutdown; measured accuracy gates take precedence.
- No real biometric data is processed until all preceding criteria pass.

## Open Questions

1. Is the first biometric pilot controlled 1:1 base access, post-event comparison,
   or a synthetic demonstration of real-time 1:N matching?
2. Which exact Defence service, site type, legal authority, and subject categories
   define that pilot?
3. What minimum iPhone generation and iOS version must be supported?
4. What controller-approved FPIR/FNIR targets and evaluation population apply?
5. May alert crops ever leave the edge, and if so under which encryption, retention,
   recipient, and two-person release policy?
6. Must restricted tenants receive a dedicated Supabase-compatible deployment cell,
   or is a fully government-hosted PostgreSQL/control plane required?

This specification is engineering context, not legal advice or deployment authority.
