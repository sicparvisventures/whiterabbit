# Plan 0003: Single PWA Delivery

- Status: active; supersedes Plan 0002 and Expo-specific tasks in Plan 0001
- Date: 2026-08-13
- Delivery: test-first, at most five implementation files per slice, atomic push

## Implementation Status — 2026-08-13

- Phase 1 complete: Expo removed; install manifest with Chromium raster fallbacks,
  real install-state guidance, service worker and security headers are live; runtime
  mock operational records were removed.
- Phase 2 Auth seam complete pending external configuration: account/policy contracts,
  optional browser/server clients, cookie refresh, verified claims, signup/signin,
  confirmation, recovery, password update and sign-out are implemented.
- Phase 3 UI complete but persistence pending: responsive routes, empty states and the
  controller-scoped onboarding form plus account/organization/deployment/capability/
  retention/legal/device settings readiness are implemented; migrations/RLS remain
  Phase 5.
- Phase 4 browser readiness complete: real foreground camera permission/preview/stop,
  cleanup, post-permission camera selection, capture-zone acknowledgement and explicit
  readiness blockers are implemented. Strict enrollment input/result contracts and a
  fail-closed provider service are ready; persisted enrollment, completion proof,
  inference and signed events remain gated.
- Phase 5 runbook is complete and the owner-created project is the next external
  handoff. Phase 6 has not started.

## Phase 1 — Consolidate and Install

1. Remove `apps/mobile`, Expo dependencies/scripts and native CI/export steps.
2. Add manifest, icons, service worker registration and safe response headers.
3. Replace the deployed sample operations dashboard with public/account/setup-required
   and empty product states containing no operational records.
4. Verify install metadata, light appearance and responsive shell in a real browser.

Acceptance: `rg` finds no active Expo/native app references outside superseded history;
the Vercel deployment remains green; manifest/service worker and 320–1440 px layouts
work.

## Phase 2 — Contracts and Real Auth Seam

1. Add Zod-backed account/session/organization/deployment/node/event/candidate schemas
   test-first.
2. Add pure controller/capability/authority policy decisions test-first.
3. Add validated optional Supabase configuration and browser/server client factories.
4. Implement signup, signin, signout, confirmation and recovery against real Supabase;
   missing configuration returns `BACKEND_NOT_CONFIGURED`.
5. Add route protection/session refresh only after request-scoped tests pass.

Acceptance: no password persistence/logging, stable result contracts, configured flows
need no code change, and unconfigured flows perform no fake mutation.

## Phase 3 — Onboarding and Product Workspaces

1. Build organization/controller/deployment/capability onboarding forms against typed
   mutation ports, disabled with actionable setup state before migrations.
2. Build mobile bottom navigation and desktop rail for Overview, Operations,
   Candidates, Watchlists, Nodes, Policies, Audit and Settings.
3. Implement loading, empty, forbidden, stale and error states for every route.
4. Add account/security, organization, deployment, capability, retention and legal
   settings surfaces.

Acceptance: all product routes are navigable and useful without invented rows; forms
are ready to bind to migrations/RLS and never claim unsaved input was saved.

## Phase 4 — Real Foreground Camera Node

1. Implement camera capability/state module with unit tests.
2. Add explicit permission/preview/stop UI and visibility/unmount cleanup.
3. [complete] Add capture-zone acknowledgement, camera selector and readiness
   diagnostics.
4. [complete] Define—but do not fake—policy, model, backend and signed-node readiness
   blockers.

Acceptance: supported HTTPS browsers show a real local camera preview; stopping or
hiding releases tracks; no request contains frames; Sentry inference stays blocked
until its genuine adapters exist.

## Phase 5 — Supabase Project Handoff

When the owner creates Supabase, request:

1. project URL;
2. publishable key;
3. project reference for CLI linking;
4. confirmation of the allowed Vercel production/preview callback URLs;
5. confirmation that email/password and email verification are enabled.

Then add versioned migrations, triggers, RLS, storage policies, typed repositories and
cross-tenant negative tests before uploading any data. Secret/service-role credentials
must be provided through approved secret tooling, never chat, Git or `NEXT_PUBLIC_*`.

## Phase 6 — Detection and Operational Completion

Object, ALPR and biometric implementations each require exact runtime/model/weight
approval, synthetic/consented evaluation, browser/device benchmark and privacy network
inspection. Implement in that order behind the real camera and policy contracts. No
score is identity; no candidate automatically authorizes action or publication.

## Verification After Every Phase

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate --strict
```

Browser checks cover console, network, manifest, service-worker registration,
keyboard, accessibility and responsive screenshots. GitHub Actions and the Vercel
production alias must be green before the next phase.
