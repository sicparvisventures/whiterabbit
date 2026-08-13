# Specification 0003: Synthetic Defence Administrative Pilot

- Status: approved for implementation planning; product code not yet authorized
- Date: 2026-08-13
- Controller profile: `BE-DEFENCE-ADMIN`
- Data classification: synthetic development data only
- Depends on: Specifications 0001 and 0002, ADR-0004 through ADR-0006

## Objective

Prove that one authorized operator can turn an iPhone into a visible foreground
camera node, run ALPR, object detection, and a synthetic biometric watchlist locally,
submit minimal signed candidates, and review them in a separate desktop command
center without transmitting raw video or creating a public tracking service.

This pilot validates product contracts and usability. It does not validate a legal
basis, authorize real surveillance, or represent an operational Defence deployment.

## Fixed Pilot Boundary

| Dimension | Approved synthetic value |
| --- | --- |
| Deployment | One `BE-DEFENCE-ADMIN` deployment |
| Purpose | Synthetic administrative site-security workflow validation |
| Site | One fictional administrative entrance and perimeter |
| Operators | Synthetic accounts representing admin, operator, reviewer, and auditor |
| Nodes | 1 to 10 enrolled iPhones; one active camera per device |
| ALPR | Synthetic Belgian-style plates and synthetic government-fleet labels only |
| Objects | Vehicle, person-presence/count, animal, obstruction, motion, and tamper |
| Biometrics | Synthetic `REALTIME_IDENTIFICATION_1_TO_N` benchmark only |
| Watchlist | At most 1,000 generated identities; no real reference photo or identity |
| Evidence | Explicitly generated candidate crops, encrypted and restricted |
| Candidate retention | Maximum 24 hours, then automatic deletion |
| Raw video | Node-local volatile processing only; never uploaded or centrally archived |
| Public projection | Disabled |
| Federation | Disabled; no circles, bridges, merges, or cross-controller access |
| Hosting | Local development or approved synthetic Supabase/Vercel preview only |

The biometric mode is intentionally the technically hardest synthetic benchmark. Its
selection here does not make real-time 1:N lawful or available for real data. Any
real mode must be separately chosen by the accountable controller after the gates in
Spec 0002.

## Primary Scenario

1. A synthetic administrator signs in with Supabase Auth and completes TOTP MFA.
2. The administrator creates a one-time, short-lived node enrollment claim for the
   fictional site and scans it with an iPhone.
3. The phone creates its device key, registers the public key, downloads signed
   policy/model/watchlist manifests, and reports ready or a specific fail-closed state.
4. An operator mounts the phone safely, connects power, confirms the capture mask,
   and explicitly starts `Sentry Mode` while the app remains visible.
5. The node detects synthetic vehicles, objects, plates, and faces locally. It drops
   non-candidates and bystander face data immediately.
6. A qualifying observation is temporally corroborated, minimized, signed, and sent
   as an ALPR, object, or biometric candidate event. Each capability uses a distinct
   payload schema and permission.
7. A restricted reviewer sees a candidate—not an asserted match—along with provenance,
   quality, policy, model, node health, and synthetic evidence where permitted.
8. The reviewer confirms, rejects, or marks the candidate inconclusive. No decision
   publishes data or initiates an external action.
9. Revocation stops new matching, deletion removes expired evidence, and the audit
   record proves the policy and human decisions without retaining biometric material.

## Functional Scope

### Mobile node

- Email/password sign-in and TOTP step-up for enrollment or review actions.
- One-time QR/deep-link enrollment into one deployment and space.
- Camera permission, capture mask, mounting, power, and connectivity readiness checks.
- Visible start/stop control for foreground `Sentry Mode`.
- Local inference pipeline status by capability and model version.
- Offline event queue with explicit count, expiry, retry, and discard behavior.
- Health states for camera, thermal pressure, power, storage, policy expiry, watchlist
  expiry, signing key, last heartbeat, and last accepted event.
- Immediate local stop, remote desired-state disable, node revocation, and package
  expiry. Remote commands cannot silently start the camera.

### Desktop command center

- Deployment overview, node health, restricted candidate queues, event explorer,
  synthetic watchlist governance, policy status, retention status, and audit history.
- Map/table/timeline representations of synthetic events with provenance preserved.
- Maker-checker workflow for synthetic watchlist packages.
- Human review with `confirmed`, `rejected`, and `inconclusive` outcomes.
- Search only inside the authenticated deployment and permitted data class.
- No public map, bulk biometric export, face search, or cross-tenant analytics.

## Data Rules

- Tenant and deployment scope come from verified authorization context, never from a
  client-supplied field alone.
- Full plate text, face embeddings, reference images, and non-match crops are absent
  from shared logs, analytics, notifications, and public schemas.
- Synthetic plate strings may exist only in marked test fixtures and ephemeral local
  inference state. Central candidate payloads use opaque references or keyed,
  deployment-scoped tokens.
- Candidate evidence uses a private bucket, per-object authorization, encryption,
  content-type allowlisting, size limits, malware-safe decoding, and a 24-hour maximum
  expiry. The database stores expiry and deletion evidence, not an immortal URL.
- The audit domain records who changed authority, policy, watchlist, retention, node,
  and review state. It never records biometric vectors or image bytes.

## Explicit Non-Goals

- No real Defence site, camera position, employee, visitor, vehicle, route, case,
  mission, reference photo, watchlist, or plate.
- No police, intelligence, municipal, armed-forces operations, or public-space pilot.
- No covert capture, background camera, locked-screen capture, remote camera start,
  audio recording, or central continuous video.
- No autonomous identity decision, access denial, intervention, or alert to an
  external operational system.
- No production dependency, cloud resource, App Store/TestFlight distribution, or
  model artifact is approved by this specification alone.

## Acceptance Criteria

- Every event has a verified node signature, monotonic anti-replay context, deployment,
  purpose, profile, classification, policy version, and model version where relevant.
- Cross-tenant, expired, revoked, wrong-purpose, wrong-model, unsigned, replayed, and
  out-of-order fixtures fail closed.
- Network inspection proves that raw video, full frames, non-match face crops,
  embeddings, and unapproved plate text never leave the phone.
- Sentry Mode stops and releases the camera when the app backgrounds, policy expires,
  thermal limits are exceeded, the node is revoked, or the operator stops it.
- A 60-minute synthetic run survives intermittent connectivity without duplicate or
  misordered accepted events and clearly reports degraded state.
- Candidate evidence expires within 24 hours and a deletion audit event remains.
- VoiceOver, Dynamic Type, reduced motion, 44-point targets, keyboard navigation,
  contrast, and small-phone/landscape layouts pass the product UX checklist.
- The repository threat model has no unresolved critical item for this synthetic
  slice, and every high item has an owner and verification task.

## Exit Gate

Completion permits planning or implementing the synthetic vertical slice only. A
real-data pilot requires a new signed scope naming the accountable Defence service,
controller/processor roles, exact statutory purpose, legal basis, camera procedure,
DPIA/FRIA outcome, watchlist authority, retention, notices, rights handling, model
approval, hosting accreditation, security authorization, oversight, and human response
procedure.
