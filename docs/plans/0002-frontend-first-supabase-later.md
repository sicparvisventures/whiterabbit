# Plan 0002: Frontend-First, Supabase-Later Delivery

- Status: approved direction; implementation can proceed incrementally
- Date: 2026-08-13
- Scope: synthetic web/mobile product behavior before hosted persistence
- Depends on: Plan 0001 P1, Specs 0003–0004 and ADR-0007

## Outcome

Build the complete reviewable WhiteRabbit experience against generated fixtures and
executable domain rules before connecting Supabase. The web and mobile clients must
consume stable ports rather than importing Supabase directly. Replacing the fixture
adapter with Supabase Auth/Postgres/RLS/Storage later must not change screen contracts,
policy decisions, event states, or candidate terminology.

Vercel hosts only `apps/web`. Expo iOS builds use the Expo development/EAS/TestFlight
path later; Vercel neither builds nor distributes the native iPhone application.

## Architecture Decisions

- Domain schemas and state transitions live in shared packages with no React,
  Supabase, browser or native imports.
- Clients depend on repository interfaces such as `CandidateRepository` and
  `NodeRepository`, initially implemented by generated fixture adapters.
- Synthetic fixture state may be in memory or explicitly labelled local development
  storage. No design assumes that browser storage is suitable for restricted data.
- Auth screens use a conspicuous synthetic session provider until Supabase Auth is
  connected. A fixture role never claims real authentication or `aal2`.
- Consequential actions call tested use cases and return audit-style receipts; they do
  not mutate ad-hoc component state directly.
- No fake camera stream, model score, signature verification, persistent audit claim,
  RLS claim or cloud health indicator is presented as operational.

## Dependency Graph

```text
shared schemas and policy decisions
        │
        ├── fixture generators
        │       └── repository adapters
        │               ├── Next.js screens
        │               └── Expo screens
        │
        └── use cases and receipts
                └── interaction tests

Supabase Auth/Postgres/RLS/Storage
        └── later adapters implementing the same repositories
```

## Phase A — Executable Product Core

### Task A1: Candidate and node schemas

**Description:** Make the relevant Spec 0004 event, candidate, node-health and review
receipt shapes executable with Zod and inferred TypeScript types.

**Acceptance criteria:**

- Invalid capability/state combinations fail closed.
- ALPR, object and biometric payloads remain distinct discriminated unions.
- No public projection type accepts biometric or exact node-location fields.

**Verification:** failing tests first, then `pnpm test`, `pnpm typecheck` and fixture
parse tests.

**Dependencies:** P1 foundation. **Estimated scope:** Medium, 3–5 files.

### Task A2: Controller and capability policy

**Description:** Implement pure decisions for controller profile, role, purpose,
classification, authority expiry and biometric mode.

**Acceptance criteria:**

- Unknown, expired and cross-profile contexts deny.
- Municipal biometrics are disabled by default.
- Review and publication decisions explain their stable deny reason.

**Verification:** table-driven policy tests from Specs 0001–0004.

**Dependencies:** A1. **Estimated scope:** Medium, 3–5 files.

### Task A3: Repository ports and fixture adapter

**Description:** Define read/write interfaces for overview, candidates, nodes,
watchlists, policies and audit receipts, with deterministic generated fixtures.

**Acceptance criteria:**

- Clients import ports, not fixture implementation details.
- Fixture generation is deterministic and contains no real identity, plate or place.
- Review mutations produce policy-checked receipts and can be reset.

**Verification:** adapter contract tests and repository-wide synthetic-data scan.

**Dependencies:** A1–A2. **Estimated scope:** Medium per repository, delivered as
separate 3–5-file slices.

## Checkpoint A

- Shared tests, typecheck, lint and builds pass.
- Every UI-visible state is constructible from typed fixtures.
- No Supabase package or environment variable is required to run either client.

## Phase B — Complete Web Product Shell

### Task B1: Route and layout foundation

Create typed Next.js routes for Overview, Operations, Candidates, Watchlists, Nodes,
Policies and Audit with persistent light-only navigation and responsive pane layout.

**Acceptance:** every route is directly addressable, keyboard reachable and has
loading/empty/error/stale variants. **Dependencies:** A3. **Scope:** Medium per route.

### Task B2: Operations workspace

Build synchronized generated event rail, fictional map abstraction, timeline and
provenance inspector using one selection model.

**Acceptance:** selection remains synchronized; coordinates say fictional/restricted;
no external map dependency is required. **Dependencies:** B1. **Scope:** Medium slices.

### Task B3: Candidate review workflow

Implement queue filters, candidate detail, evidence-unavailable state, guarded review
dialog and receipt using the policy/use-case layer.

**Acceptance:** `Candidate` terminology is enforced; confirm/reject/inconclusive all
return receipts; denied actions show the policy reason. **Dependencies:** A2–A3, B1.

### Task B4: Governance workspaces

Implement watchlist package status, node readiness, effective policy and append-style
audit views against fixture repositories.

**Acceptance:** expiry/revocation/degraded states are testable and no synthetic action
claims persistence or signature validation. **Dependencies:** A3, B1.

## Checkpoint B

- Playwright covers navigation, synchronized selection and all review outcomes.
- Accessibility and responsive checks pass at 1024, 1280 and 1440 px.
- Every push to `main` deploys the web app automatically to Vercel.

## Phase C — Complete Expo Field Experience Without Camera Input

### Task C1: Native navigation and synthetic session

Add Sentry, Alerts, Nodes and More tabs plus generated sign-in/MFA/enrollment routes.

**Acceptance:** routes resume correctly; session is always labelled synthetic; no
credential is sent or stored. **Dependencies:** A3. **Scope:** Medium per route group.

### Task C2: Sentry lifecycle simulator

Implement the pure readiness/start/stop/background/revoked/thermal state machine
without mounting a camera.

**Acceptance:** remote start is impossible; every unsafe transition stops; UI state is
driven by tested lifecycle decisions. **Dependencies:** A2. **Scope:** Medium.

### Task C3: Mobile candidate and receipt flow

Use the same candidate contracts and review use cases as web in a native layout.

**Acceptance:** outcome and deny reasons match web contract tests; large text and
screen-reader labels preserve all actions. **Dependencies:** A3, C1. **Scope:** Medium.

## Checkpoint C

- Expo compatibility, typecheck, iOS export and native navigation tests pass.
- No camera permission appears in the native manifest.
- The implementation can be reviewed in a simulator/development build with generated
  data only.

## Phase D — Supabase Connection

Only after A–C are stable:

1. Run local Supabase and add migrations for tenants, roles, nodes, candidates,
   reviews, watchlist metadata, policies and append-evident audit records.
2. Implement email/password Auth plus TOTP `aal2` for privileged fixture roles.
3. Add deny-by-default RLS and cross-tenant negative tests before UI integration.
4. Implement Supabase repository adapters behind the existing ports.
5. Add private storage grants and retention only after deletion/orphan tests.
6. Provision a hosted synthetic project only after local evidence and Gate G4 scope.

The fixture adapter remains available for Storybook-style review, offline tests and
deterministic demos. Production builds must fail closed if a required backend context
is absent; they never silently fall back to fixtures.

## What Remains Impossible Without Later Gates

- Real user authentication, MFA assurance, durable multi-user state and RLS proof.
- Real camera capture, native keys, signed node identity and background/lifecycle proof.
- ALPR, object or face models, watchlist matching and accuracy/fairness evidence.
- Real evidence storage, retention/deletion proof and operational audit integrity.
- Any claim of legal deployment readiness, government accreditation or authority.

## Immediate Next Checkpoint

Implement A1 and A2 test-first, then refactor the current web page onto the first
fixture repository. This proves the Supabase-later seam before expanding seven web
destinations or the mobile route tree.
