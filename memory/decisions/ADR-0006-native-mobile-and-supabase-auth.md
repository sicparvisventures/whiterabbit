# ADR-0006: Native Mobile Edge and Supabase Authentication

- Status: accepted for synthetic implementation planning
- Date: 2026-08-13
- Depends on: ADR-0004 and ADR-0005

## Context

WhiteRabbit needs to turn an old iPhone into a credible camera node while also
providing fast field review and a premium desktop command center. A browser camera
route cannot provide the required native navigation, device integration, inference
adapter, lifecycle control, or iOS 26 experience. The first authentication method
also needs to remain deliberately small while preserving a path to higher-assurance
government identity later.

## Decision

Build two first-class TypeScript clients:

- `apps/mobile`: an Expo/React Native development build for iPhone camera-node and
  field workflows;
- `apps/web`: a Next.js desktop operational command center, deployable to Vercel only
  for an approved classification and controller profile.

Use Supabase Auth with email and password for human users in the synthetic pilot.
Do not add social login, enterprise SSO, or customer-managed identity federation in
phase 1. Require Supabase MFA assurance level `aal2` for watchlist administration,
candidate review, security administration, and other privileged actions.

Human sessions do not identify camera nodes. Each node receives a separate,
deployment-scoped asymmetric device identity through an approved enrollment flow.
Node keys, signed policy packages, and signed events remain valid independently of a
human login session and can be revoked independently.

Use native system navigation and controls where possible. On iOS 26, standard native
headers and tab bars provide the system Liquid Glass treatment. Custom glass effects
are limited to the functional navigation/control layer; operational content uses
opaque, high-contrast surfaces.

## Consequences

- Expo Go is insufficient because local inference and device identity require native
  modules; development, preview, and production builds are versioned artifacts.
- The camera runs only while the app is visible in an explicit `Sentry Mode`. The
  product does not claim locked-screen or hidden background-camera operation on iOS.
- Mobile navigation may use Expo Router native tabs only after its alpha API is
  isolated behind a small navigation boundary and upgrade risk is accepted.
- Supabase user JWTs authorize user-facing APIs through fail-closed tenant policies;
  the client-supplied tenant identifier is never the source of authorization.
- RLS is mandatory for the synthetic shared control plane but is not treated as
  sufficient isolation for restricted or classified authority data planes.
- SSO remains a future adapter. Adding it must not alter domain roles, policy context,
  node identity, or event signatures.
- The desktop visual direction may evoke a premium operational-intelligence workspace,
  but it must not copy Palantir trade dress or imply affiliation.

## Review Gate

The project owner accepted Expo mobile, Supabase Auth without SSO, an iOS 26-native
experience, and a premium desktop direction on 2026-08-13. Production dependencies,
cloud provisioning, real identities, real camera feeds, and biometric model artifacts
remain subject to the implementation and institutional gates in Specs 0001 and 0002.
