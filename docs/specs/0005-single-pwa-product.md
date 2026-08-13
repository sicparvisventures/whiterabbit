# Spec 0005: Single Responsive PWA Product

- Status: owner-approved for implementation
- Date: 2026-08-13
- Product language: English
- Deployment: Vercel-hosted Next.js PWA; light appearance only
- Data rule: no runtime mock, generated or seeded operational records

## Implementation Checkpoint — 2026-08-13

The installable shell, public/account/setup/product routes, real Supabase Auth seam,
conditional verified-claims route protection and foreground camera lifecycle are
implemented and tested. No Supabase project, migrations/RLS, node identity, inference,
event ingest or operational record exists. The remaining acceptance items depend on
the Supabase handoff and separately approved model/runtime work.

## Objective

Build WhiteRabbit as one installable, mobile-first web application that lets a user
create an account, sign in, establish an organization/deployment, configure camera
nodes and use a foreground browser camera as a Sentry where the browser permits it.
The same application expands into an information-dense desktop command center for
operations, candidates, watchlists, nodes, policy, audit and settings.

Success means one codebase and URL behave credibly at 320 px through wide desktop,
can be installed to a home screen, request a camera only through an explicit action,
and connect to Supabase without redesigning screens or domain contracts.

## Assumptions Fixed by Owner Direction

1. There is no Expo/native application in the current product architecture.
2. Vercel hosts the PWA and every push to `main` deploys production automatically.
3. Supabase Auth uses email/password first; no social login or SSO.
4. Before Supabase exists, real data views are empty and account mutations fail
   closed with configuration guidance. The public app ships no mock records.
5. Test-only in-memory inputs are allowed when they prove pure contracts; they are not
   bundled or selectable in production.
6. Browser camera capture is foreground-only. Detection/inference remains a separate
   gated implementation with exact model/runtime provenance.

## User Journeys

### Public and account

- Landing page explains edge-first processing and offers `Create account` and
  `Sign in`.
- Create account accepts email, password, password confirmation and terms acceptance.
- When Supabase is configured, signup calls Supabase Auth and displays the real result,
  including email-verification state without account-enumeration copy.
- Sign in, sign out, forgotten password, auth confirmation and password update use the
  same configured provider. Missing configuration never creates local credentials.

### First-run setup

- An authenticated user creates or joins one organization and selects a controller
  profile from the supported Belgian set.
- The setup wizard records organization name, intended purpose, deployment label,
  data classification acknowledgement and enabled capabilities.
- Biometrics are off by default and require a separately authorized profile/policy.
- Until migrations exist, setup routes explain that storage is not provisioned and do
  not claim to save input.

### Mobile field mode

- Bottom navigation exposes Home, Sentry, Alerts, Nodes and Settings.
- Sentry shows browser/HTTPS/visibility/camera/backend/policy readiness independently.
- `Enable camera` requests the environment-facing camera after a user gesture.
- `Start Sentry` remains disabled until required policy/backend/model controls exist;
  camera preview alone is not described as detection.
- Stop, page hide, permission loss and unmount release all camera tracks.

### Desktop command center

- A left navigation rail exposes Overview, Operations, Candidates, Watchlists, Nodes,
  Policies, Audit and Settings.
- Every list shows an accessible empty state until real RLS-scoped rows exist.
- Operations uses a real map adapter only after configuration; it never invents
  coordinates, events or node health.
- Candidate actions require a real authenticated `aal2` session and persisted policy;
  no client-only review receipt is accepted as audit evidence.

## Technology and Commands

- Next.js `16.3.0`, React `19.2.8`, TypeScript `5.9.3`.
- `@supabase/ssr` and `@supabase/supabase-js` at the ADR-0007 approved pins.
- Native App Router manifest plus a small same-origin service worker; no PWA framework
  dependency in the first slice.
- Browser media APIs are isolated behind a tested camera-session module/component.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev:web
corepack pnpm test
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm build
```

## Project Structure

```text
apps/web/app/(public)/       landing and account routes
apps/web/app/(product)/      responsive authenticated product routes
apps/web/app/auth/           confirmation and recovery callbacks
apps/web/components/         focused responsive UI components
apps/web/lib/supabase/       configuration, browser/server clients and session proxy
apps/web/public/             icons and service worker
packages/contracts/          validated domain and API schemas
packages/policy/             pure fail-closed authorization/state decisions
packages/design-tokens/      single light semantic theme
supabase/migrations/         added only after a project/local stack is approved
```

## Code Style

Validate external input once at the boundary and return a discriminated result:

```ts
type AccountResult =
  | { status: "CREATED"; requiresEmailVerification: boolean }
  | { status: "BACKEND_NOT_CONFIGURED" }
  | { status: "REJECTED"; code: string; message: string };
```

Use Server Components by default. Add `"use client"` only for forms, install prompts,
camera APIs or local interaction. Components render data passed through typed
contracts and never define operational arrays inline.

## Testing Strategy

- Unit: contract parsing, policy decisions, form validation and camera lifecycle.
- Integration: Auth actions with an injected provider contract; unconfigured provider
  must fail closed without network or persistence.
- Browser: landing, account, setup-required, empty product views, responsive
  navigation, manifest/service-worker and camera unsupported/denied/stop flows.
- Production: build plus HTTPS Vercel smoke test and manifest inspection.

## Boundaries

### Always

- Release camera tracks on every stop/visibility/unmount path.
- Validate provider responses and user input.
- Display whether Auth, data, policy, camera and inference are actually configured.
- Keep human and node identity separate in contracts.

### Ask/approve separately

- Supabase project linking, migrations and hosted data changes.
- Model/runtime/weight dependencies, map providers and push-notification providers.
- Any real operational data or public projection.

### Never

- Ship runtime mock users, nodes, candidates, plates, faces, locations or health.
- Store passwords or imitate signup in local/session/browser storage.
- Use a secret/service-role key in `NEXT_PUBLIC_*` variables.
- Claim that camera preview equals ALPR, object detection or biometric matching.
- Run or claim camera capture while hidden/backgrounded.

## Acceptance Criteria

- Expo and React Native no longer exist in manifests, CI, active architecture or app
  directories.
- `/manifest.webmanifest` is valid, standalone and light-only; the service worker is
  same-origin and served with safe cache/security headers.
- Public, account, setup and product shells work at 320, 768, 1024 and 1440 px.
- Signup/signin call real Supabase when configured and return an honest unconfigured
  result otherwise.
- Camera preview works over HTTPS on a supported browser and always stops safely.
- Empty operational routes contain zero sample operational records.
- Tests, builds, memory validation, GitHub Actions and Vercel production pass.
