# Specification 0004: Signed Event and Application API Contract

- Status: partially executable; baseline header/signature primitives implemented test-first
- Date: 2026-08-13
- API base: `/api/v1`
- Event schema family: `whiterabbit.event.v1`
- Depends on: Specifications 0001–0003 and ADR-0006

## Implementation Progress

The executable `@whiterabbit/contracts/signed-event` boundary now validates the
baseline node, ALPR and object event header plus the fixed-width ES256 signature.
It intentionally excludes `biometric.candidate.v1` until the separate biometric
implementation gates are satisfied. Executable ALPR and object envelopes now bind
their payload to the signed event type, accept only deployment-pseudonymous plate
tokens and non-identifying object categories, and reject undeclared identity fields.
The optional evidence descriptor remains disabled until its storage, redaction,
expiry and retrieval-grant controls exist. Canonicalization, signing, verification
and ingest remain unimplemented.

The executable baseline candidate projection contains only scope/provenance state,
classification, data nature, optimistic-concurrency version and the mandatory human
review marker. It excludes plate, identity and evidence detail. Candidate transition
logic implements only the state graph below; human review input cannot claim reviewer
identity, resource version or expiry authority.

## Contract Goals

- Authenticate a node independently from a human Supabase session.
- Bind every event to one deployment, purpose, controller profile, policy version,
  capability, device key, and monotonic sequence.
- Keep ALPR/object observations separate from biometric candidates.
- Make retries idempotent and replays detectable.
- Keep provider SDKs and database rows behind a stable application/domain contract.
- Minimize payloads so raw video, embeddings, civilian plate text, and unapproved
  evidence never become normal API fields.

## Versioning Rules

- The URL major version changes only for an intentionally incompatible API.
- Every event has an independently versioned `schemaVersion` and `eventType`.
- Additive optional response fields are backward compatible. New required request
  fields, changed meaning, removed enum values, or weaker validation require a new
  event or API major version.
- Consumers must reject an unknown major schema or event type. They must ignore an
  unknown optional response field unless it conflicts with a signed digest.
- Enum values are closed in requests and signatures. There is no generic string
  fallback for profile, classification, capability, review, or authority state.

## Signed Node Envelope

```ts
type ControllerProfile =
  | "BE-DEFENCE-ADMIN"
  | "BE-ARMED-FORCES-OPS"
  | "BE-INTEL"
  | "BE-POLICE"
  | "BE-MUNICIPAL";

type DataClassification = "PUBLIC" | "OFFICIAL" | "RESTRICTED" | "CLASSIFIED";
type DataNature = "SYNTHETIC" | "REAL";

type EventType =
  | "node.heartbeat.v1"
  | "node.security.v1"
  | "alpr.candidate.v1"
  | "object.observation.v1"
  | "biometric.candidate.v1";

type SignedNodeEvent<TPayload> = Readonly<{
  header: Readonly<{
    schemaVersion: "whiterabbit.event.v1";
    eventType: EventType;
    eventId: string; // UUIDv7
    deploymentId: string; // UUID
    spaceId: string; // UUID
    nodeId: string; // UUID
    keyId: string; // opaque registered key ID
    counterEpochId: string; // UUID bound at enrollment/key rotation
    sequence: string; // unsigned decimal string; monotonic per epoch
    occurredAt: string; // RFC 3339 UTC with milliseconds
    controllerProfile: ControllerProfile;
    purposeId: string;
    policyVersion: string;
    capabilityAuthorityId: string;
    classification: DataClassification;
    dataNature: DataNature;
    previousEventDigest?: string; // base64url SHA-256; absent only at epoch start
  }>;
  payload: TPayload;
  signature: Readonly<{
    algorithm: "ES256";
    value: string; // base64url fixed-width JOSE R || S
  }>;
}>;
```

The version-1 signature input is the UTF-8 encoding of RFC 8785 JSON Canonicalization
Scheme output for `{ "header": header, "payload": payload }`. `eventDigest` is the
base64url SHA-256 of those same bytes. The signature covers every field above but not
server-derived receipt, authorization, or processing state.

`ES256` is the v1 interoperability target because P-256 can be backed by platform
key stores on supported devices. Hardware-backed availability, attestation, and the
exact React Native adapter remain technology-validation gates; unsupported devices
must not silently export a plaintext private key.

## Ingest Validation Order

The server performs these checks in order and persists no accepted event until all
required checks succeed:

1. Enforce request size, content type, decompression, batch-count, and rate limits.
2. Parse strict JSON and validate the closed schema for `schemaVersion/eventType`.
3. Resolve node, deployment, profile, and key from server-side enrollment state.
4. Compare all signed scope fields to that state; never trust them independently.
5. Verify key status, signature algorithm, canonical signature, and referenced content
   digests.
6. Verify the signed capability authority, policy version, purpose, model/package
   references, validity window, and node/space scope.
7. Enforce unique `eventId` and `(nodeId, keyId, counterEpochId, sequence)`.
8. Enforce monotonic sequence and `previousEventDigest`; quarantine a gap, reset,
   fork, or stale epoch instead of guessing order.
9. Apply event-specific minimization, value ranges, state, and classification policy.
10. Commit the event, server `receivedAt`, decision/reason code, and audit record in
    one transaction; acknowledge only after the idempotency result is durable.

An exact retry returns the original acceptance result. A reused identifier or sequence
with different signed bytes returns a conflict and raises a security signal.

## Payload Contracts

### Node heartbeat

```ts
type NodeHeartbeatV1 = Readonly<{
  state: "READY" | "DEGRADED" | "STOPPED" | "REVOKED";
  reasonCodes: readonly string[];
  sentrySessionId?: string;
  cameraActive: boolean;
  powerSource: "BATTERY" | "EXTERNAL" | "UNKNOWN";
  batteryBand?: "CRITICAL" | "LOW" | "OK" | "FULL";
  thermalBand: "NOMINAL" | "FAIR" | "SERIOUS" | "CRITICAL" | "UNKNOWN";
  connectivity: "ONLINE" | "DEGRADED" | "OFFLINE_QUEUE";
  outboxCount: number;
  activePolicyVersion?: string;
  activeModelDigests: readonly string[];
  activePackageDigests: readonly string[];
}>;
```

Precise battery percentage, IP address, device serial number, and coordinates are not
part of the normal heartbeat.

### ALPR candidate

```ts
type AlprCandidateV1 = Readonly<{
  candidateId: string;
  observationWindow: { start: string; end: string };
  plateToken: string; // keyed, rotating, deployment-scoped; never raw plate text
  plateRegionHint?: "BE" | "UNKNOWN";
  governmentFleetHypothesis: "CANDIDATE" | "NOT_SUPPORTED";
  vehicleCategories: readonly string[];
  corroborationCount: number;
  qualityBand: "REVIEWABLE" | "LIMITED";
  modelRefs: readonly { purpose: string; version: string; digest: string }[];
  evidence?: EvidenceDescriptor;
}>;
```

The pilot permits only marked synthetic plate fixtures. A production keyed token is
rotated and scoped so it cannot become a global civilian journey identifier.

### Object observation

```ts
type ObjectObservationV1 = Readonly<{
  observationId: string;
  observationWindow: { start: string; end: string };
  categories: readonly (
    | "VEHICLE"
    | "PERSON_PRESENCE"
    | "ANIMAL"
    | "OBSTRUCTION"
    | "MOTION"
    | "TAMPER"
  )[];
  counts?: Readonly<Record<string, number>>;
  localTrackToken?: string; // expires with the observation; no cross-camera identity
  qualityBand: "REVIEWABLE" | "LIMITED";
  modelRefs: readonly { purpose: string; version: string; digest: string }[];
  evidence?: EvidenceDescriptor;
}>;
```

`PERSON_PRESENCE` is non-identifying. A face vector, persistent gait/body signature,
or cross-camera person token is forbidden in this payload.

### Biometric candidate

```ts
type BiometricCandidateV1 = Readonly<{
  candidateId: string;
  observationWindow: { start: string; end: string };
  watchlistId: string;
  watchlistVersion: string;
  subjectRef: string; // opaque, tenant-scoped watchlist entry reference
  biometricMode:
    | "VERIFICATION_1_TO_1"
    | "POST_IDENTIFICATION_1_TO_N"
    | "REALTIME_IDENTIFICATION_1_TO_N";
  similarityBand: "ABOVE_THRESHOLD" | "STRONGER_CANDIDATE";
  calibratedPolicyId: string;
  corroborationCount: number;
  faceQualityBand: "REVIEWABLE" | "LIMITED";
  detector: { version: string; digest: string };
  embedder: { version: string; digest: string };
  evidence?: EvidenceDescriptor;
  requiresHumanReview: true;
}>;
```

The payload contains no embedding, reference photo, identity claim, demographic
attribute, emotion, or automated response instruction. A more precise similarity
value, if justified for evaluation, belongs in a separately authorized evaluation
record and not the routine alert contract.

### Evidence descriptor

```ts
type EvidenceDescriptor = Readonly<{
  evidenceId: string;
  mediaType: "image/jpeg" | "image/heic";
  byteLength: number;
  sha256: string;
  encryptionKeyRef: string;
  redactionProfile: string;
  expiresAt: string;
}>;
```

There is no permanent or bearer URL in an event. An authorized API issues a short,
single-purpose retrieval grant after rechecking role, deployment, classification,
candidate state, and expiry.

## Application State Contracts

Node events are append-only observations. Server application events create state:

```text
CANDIDATE -> IN_REVIEW -> CONFIRMED | REJECTED | INCONCLUSIVE
CANDIDATE | IN_REVIEW -> EXPIRED
CONFIRMED | REJECTED | INCONCLUSIVE -> RETRACTED
```

- A transition uses optimistic concurrency on the current `version`.
- Review records are append-only; the current status is a projection.
- A confirmed biometric candidate remains restricted and cannot enter a public state.
- Public eligibility for an ALPR/object record is a separate policy decision followed
  by a separate projection job. The synthetic Defence pilot disables that job.
- Expiry deletes evidence bytes and sensitive derived fields while retaining the
  minimal deletion, policy, and review audit allowed by the retention schedule.

## Human and Device Authorization

| Route family               | Credential                              | Additional rule                                                       |
| -------------------------- | --------------------------------------- | --------------------------------------------------------------------- |
| Human read                 | Supabase user JWT                       | active deployment membership and resource policy                      |
| Human privileged mutation  | Supabase user JWT                       | `aal2`, role, purpose, classification, resource version               |
| Node enrollment completion | single-use claim + generated public key | claim scope/expiry and administrator approval                         |
| Node event ingest          | registered node key signature           | live node, authority, policy, epoch, sequence, rate policy            |
| Package download           | registered node key proof               | package scope, expiry, revocation, capability and model compatibility |

No user route accepts a service-role key. No node route accepts a user JWT as a
substitute for a device signature.

## Node HTTP Request Proof

Every node route, including event batch ingest, authenticates the HTTP request in
addition to any signatures inside the body. TLS remains mandatory. The request sends:

```text
X-WR-Key-Id: <opaque key ID>
X-WR-Timestamp: <RFC 3339 UTC>
X-WR-Nonce: <base64url 128-bit random value>
X-WR-Signature: <base64url ES256 signature>
```

The signature input is RFC 8785 canonical JSON containing the uppercase HTTP method,
normalized API path, canonical query string, SHA-256 digest of the exact transmitted
body bytes (or the empty-body digest), timestamp, nonce, key ID, and node ID. A proxy
must not rewrite the signed path/query before verification.

The server resolves the node from `keyId`, verifies method/path/body binding, permits
only a small measured clock-skew window, consumes the nonce atomically, and rate-limits
by node/key/deployment before application work. Nonces are stored only for the replay
window. A repeated nonce, timestamp outside the window, path/body mismatch, revoked
key, or algorithm mismatch fails before package, desired-state, or ingest processing.

Enrollment claims are high-entropy opaque values, stored server-side only as a digest,
short-lived, single-use, and never placed in analytics, referrers, crash reports, or
normal logs. Completion also proves possession of the newly generated private key.

## REST Resources

| Method and path                               | Purpose                                    | Auth and invariants                                        |
| --------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| `POST /api/v1/node-enrollments`               | create a short-lived claim                 | human `aal2`; admin role; idempotency key                  |
| `POST /api/v1/node-enrollments/{id}/complete` | bind node public key                       | single use; proof of possession; exact claim scope         |
| `GET /api/v1/nodes/{id}/desired-state`        | pull disable/config state                  | node signature; never starts camera                        |
| `GET /api/v1/nodes/{id}/packages`             | list permitted signed manifests            | node signature; live policy and node scope                 |
| `GET /api/v1/packages/{id}/content`           | download encrypted package                 | node signature; short response grant; digest verified      |
| `POST /api/v1/events:batch`                   | ingest ordered signed events               | node signatures; max batch policy; atomic per-event result |
| `GET /api/v1/candidates`                      | cursor-paginated restricted queue          | user membership, role, capability, classification          |
| `GET /api/v1/candidates/{id}`                 | candidate and authorized evidence metadata | user membership; evidence remains separately granted       |
| `POST /api/v1/candidates/{id}/reviews`        | append human review                        | `aal2`; reviewer role; `If-Match`; idempotency key         |
| `POST /api/v1/evidence/{id}/grants`           | issue one-use evidence retrieval           | `aal2`; candidate permission; unexpired evidence           |
| `POST /api/v1/watchlists`                     | create governed synthetic watchlist        | `aal2`; maker role; pilot scope                            |
| `POST /api/v1/watchlists/{id}/approvals`      | maker-checker decision                     | `aal2`; checker differs from maker; `If-Match`             |
| `POST /api/v1/watchlists/{id}/revoke`         | revoke list and packages                   | `aal2`; authorized role; immediate desired-state update    |
| `GET /api/v1/audit-events`                    | filtered audit view/export proposal        | auditor role; export is separately authorized and logged   |

Collection responses use opaque cursor pagination:

```json
{
  "items": [],
  "page": { "nextCursor": null, "hasMore": false }
}
```

Cursors are signed/opaque, expire, and bind filters, sort, deployment, and user scope.
Offset pagination is not used for changing operational queues.

## Mutation and Concurrency Rules

- Every externally retried `POST` requires `Idempotency-Key`. The stored key binds
  actor, deployment, route, and canonical request digest for a bounded period.
- Updates and state transitions require `If-Match: "<resource-version>"`; a stale
  version returns `412` without applying partial changes.
- Batch ingest returns a result per event. One invalid event cannot change another
  event's signed contents or ordering state.
- Server time is authoritative for receipt, expiry enforcement, and idempotency TTL.
  Signed device time is preserved as provenance and checked against a skew policy.
- Dates are RFC 3339 UTC. IDs are opaque and never encode tenant, subject, plate,
  location, or authority names.

## Error Contract

Errors use `application/problem+json` compatible with RFC 9457:

```json
{
  "type": "https://whiterabbit.invalid/problems/policy-denied",
  "title": "Policy denied the operation",
  "status": 403,
  "code": "WR_POLICY_AUTHORITY_EXPIRED",
  "correlationId": "opaque-id",
  "retryable": false
}
```

- Stable `code` values drive UI recovery and audit; localized prose does not.
- Responses never echo secrets, tokens, signed package contents, face/plate values,
  stack traces, SQL, internal paths, or authorization-policy internals.
- `401` means the credential is absent/invalid; `403` means the authenticated actor
  is not authorized; `404` may conceal a resource outside the actor's deployment;
  `409` is identifier/idempotency conflict; `412` is stale resource version; `422`
  is a structurally valid but semantically invalid request; `429` includes bounded
  retry guidance.

## Rate and Resource Policy Classes

Exact numbers are benchmarked before implementation, but the contract distinguishes:

- human authentication and recovery;
- privileged governance mutations;
- candidate reads and evidence grants;
- node enrollment;
- steady heartbeat ingest;
- burst event ingest;
- package download; and
- audit export.

Limits bind user/node, deployment, IP/network where appropriate, and global capacity.
The service applies body, batch, image, decompression, query-complexity, cursor, and
concurrency limits. Rate-limit failure cannot disable revocation or emergency stop.

## Contract Test Matrix

- Golden canonicalization/signature vectors for Unicode, number, property-order, and
  encoding edge cases across mobile and server implementations.
- Exact retry, conflicting retry, duplicate event ID, duplicate counter, counter gap,
  stale epoch, digest fork, expired key, revoked node, and clock-skew cases.
- Every unknown/invalid enum, version, UUID, timestamp, decimal sequence, digest,
  evidence descriptor, count, and model/package reference.
- Cross-tenant, cross-purpose, cross-space, cross-profile, cross-classification,
  cross-watchlist, and cross-model attempts.
- `aal1` denial and `aal2` success for every privileged human route.
- Maker-checker self-approval denial, optimistic-concurrency collision, and revoke
  race with package download/event ingest.
- Proof that serialized/logged/error responses contain no raw plate, embedding,
  reference photo, non-match crop, signed secret, or service credential.
- Property/fuzz tests for parsers and image metadata; resource-exhaustion tests for
  batches, evidence, cursors, filters, and compressed inputs.

## Open Implementation Decisions

- Select and approve the JSON schema/validator and code-generation approach.
- Validate secure P-256 key generation/signing and recovery behavior on supported
  iPhones; define a deny path for devices without acceptable key protection.
- Choose the application API runtime and whether synthetic Supabase access is
  exclusively server-mediated or permits carefully limited direct RLS reads.
- Define exact rate, skew, outbox, idempotency, and counter-gap thresholds from load
  and failure testing.
- Define audit tamper-evidence and independent export/retention mechanisms for each
  deployment topology.
