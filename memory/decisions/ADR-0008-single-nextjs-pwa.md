# ADR-0008: Single Vercel-Hosted Next.js PWA

- Status: accepted; supersedes ADR-0006 mobile-client choice and the Expo portions of ADR-0007
- Date: 2026-08-13
- Depends on: ADR-0004, ADR-0005 and ADR-0007 light-only decision

## Context

The owner requires one TypeScript/React application that runs as a mobile-optimized
installable web app and as a premium desktop command center, with every release hosted
on Vercel. Maintaining a separate Expo/React Native client no longer serves that
deployment model. The owner also rejected shipped mock/generated records: until a
real Supabase project exists, the product must show truthful empty, disconnected and
configuration-required states.

## Decision

WhiteRabbit uses one `apps/web` Next.js App Router application as both:

- an installable, standalone, light-only PWA on iPhone, Android and desktop; and
- the responsive desktop operations and governance workspace.

Remove `apps/mobile`, Expo, React Native, Expo Router and native-build CI. Mobile and
desktop routes share domain contracts, session state and backend adapters, while CSS
and composed components provide form-factor-specific navigation and layouts.

The PWA may use `navigator.mediaDevices.getUserMedia()` after an explicit user action
to show a local, foreground-only camera preview. It must stop all media tracks when
the user stops, the page hides, permission is lost, or the component unmounts. No
remote start, hidden capture, background-camera claim or upload occurs by default.

Supabase remains the selected future adapter for email/password Auth, MFA, Postgres,
RLS and private Storage. The complete integration code may exist before credentials,
but it must fail closed when either public environment variable is absent. Production
code never falls back to sample accounts, generated candidates, pretend nodes or
browser-local substitutes for server persistence.

## Required Supabase Configuration

When the owner creates the project, WhiteRabbit requires only these public connection
values for initial Auth wiring:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Database migrations, RLS and server-side administration will be applied through the
Supabase CLI/project link later. A service-role or secret key is never placed in a
browser or committed to Git.

## Consequences

- One Vercel deployment and one route tree cover all user-facing clients.
- Account creation becomes genuinely functional as soon as Supabase environment
  values and redirect URLs are configured; before then it returns a stable
  `BACKEND_NOT_CONFIGURED` state rather than creating a fake account.
- PWA camera capability is more portable but less capable than a native background or
  secure-device runtime. Unsupported browsers and unsafe lifecycle states deny Sentry.
- Native keys, attestation and sustained edge inference require separately reviewed
  web-capable implementations or a future superseding architecture decision.
- The dependency audit loses the Expo toolchain/parser findings when removal lands.

## Rollback

Revert the PWA consolidation commits and restore the last green Expo workspace only
if the owner supersedes this decision. Supabase data contracts and light-only UX must
remain portable across either client architecture.
