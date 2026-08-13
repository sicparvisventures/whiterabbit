# Current State

## Checkpoint

Date: 2026-08-13

The WhiteRabbit repository is public at https://github.com/sicparvisventures/whiterabbit on branch `main` with repository-local author `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.

The SparrowMap upstream is available as an ignored, clean research checkout in `sparrowmap/` at commit `dc78ec9e96d01e074c98338a8bf3de8d28f33578`, tag `v0.1.0`. It is not vendored into WhiteRabbit.

## Approved Direction

- Public, English-language, AGPL-3.0-compatible project named WhiteRabbit.
- Belgian public-sector ALPR is the initial product direction.
- Belgian Defence is the first intended deployment; municipalities and police must be supported as separate controller profiles.
- Government-vehicle detections may become public only when the controller profile permits it, after corroboration and human review. Military, police, investigative, and other sensitive movements are restricted by default.
- SparrowMap code may be reused lawfully with attribution.
- Person and object data are potential OSINT inputs, but identifying or persistent person tracking is not approved for implementation.
- ALPR and object detection remain core. A tenant-scoped biometric watchlist is an additional approved product direction, with implementation and all real biometric processing still gated by Spec 0002, legal authority, DPIA/FRIA, threat model, model review, and controller approval.
- WhiteRabbit is one installable, mobile-first Next.js PWA for field and desktop workflows. Supabase Auth email/password is the phase-1 human login; privileged roles require MFA `aal2`, while nodes use separate revocable device identities. SSO is deferred.
- Vercel hosts the public PWA. Supabase remains unprovisioned and is a candidate only
  for approved non-sensitive profiles. Restricted, operational, intelligence or
  classified profiles require an accredited or self-hosted topology.
- Frequent atomic pushes are approved after validation.
- The combined mobile/desktop information architecture, synthetic implementation and
  dependency batch D1 are approved. WhiteRabbit is light-only with no dark/system
  theme selector.

## Implemented

- Repository-native memory validator and bounded bootstrap tool.
- Content fingerprinting that detects stale heartbeat state.
- Secret scanning for managed memory files.
- Codex `SessionStart`, `Stop`, and `SessionEnd` hooks.
- Stop-hook loop prevention.
- Nine unit/integration tests covering the memory tool and hooks.
- Public GitHub repository and protected source history.
- GitHub Actions CI for tests and strict memory validation.
- Tagged foundation release `v0.1.0-foundation`.
- Owner-approved synthetic-planning Belgian controller-profile specification and ADR-0004 covering Defence administration, armed-forces operations, intelligence, police, and municipalities.
- Owner-approved synthetic-planning biometric-watchlist specification and ADR-0005 defining isolated modes, scoped watchlists, local matching, human review, and government data-plane cells.
- ADR-0006 historically selected Expo/React Native mobile and Next.js desktop;
  ADR-0008 supersedes that client choice while preserving Supabase Auth without SSO
  and separate node identities.
- Spec 0003 fixes the first executable boundary at one fictional `BE-DEFENCE-ADMIN` site, 1–10 iPhone nodes, synthetic ALPR/objects, a maximum 1,000-identity synthetic real-time 1:N benchmark, 24-hour candidate evidence, no public projection, and no federation.
- Architecture 0001 defines the planned mobile edge, web command center, provider boundaries, separate human/node identity, edge pipeline, storage domains, and deployment topologies.
- Product Experience 0001 defines a native iOS 26 field instrument and an accessible, premium, information-dense desktop command center without copying third-party trade dress.
- Spec 0004 defines versioned signed node events, canonical ES256 event/request proofs, monotonic anti-replay context, distinct ALPR/object/biometric payloads, stable REST resources, authorization, idempotency, concurrency, error, and contract-test rules.
- The repository-grounded threat model identifies cross-tenant access, watchlist abuse, supply-chain substitution, node compromise, false biometric escalation, retention leakage, public projection, account compromise, denial of service, unsafe parsers, federation, and public-repo leakage. Runtime controls are explicitly unimplemented.
- Compliance 0001 defines profile routing and gates for product scope, provenance, legal authority, DPIA/FRIA/AI classification, security/hosting, model/device validation, human procedure, real pilot, scale, publication, and federation.
- Plan 0001 sequences the synthetic product into phases P1–P11 with dependency batches, test-first tasks, five-file implementation limits, acceptance evidence, atomic pushes, and explicit stop conditions.
- A dependency-free interactive prototype now covers the complete mobile field flow plus a desktop command center with overview, synchronized operations workspace, candidate review, governed watchlists, node health, effective policy, audit stream, density controls, and a keyboard command palette. It is demonstrative only: no camera, inference, network, identity, or backend capability is present.
- Product Experience 0002 and the prototype README record the review routes, interaction inventory, responsive evidence, accessibility limits, non-capabilities, and the owner approval checklist.
- ADR-0007 pins the P1 toolchain/dependency provenance and records the single light
  appearance. The old prototype theme selector and dark desktop shell were removed.
- A pnpm 11 workspace now has strict TypeScript, ESLint, Prettier and Vitest baselines,
  deterministic installs, blocked dependency build scripts and shared light-only
  semantic design tokens with tests.
- ADR-0008, Spec 0005, Architecture 0002 and Plan 0003 replace the Expo/dual-client
  direction with one installable Next.js PWA, foreground browser camera lifecycle,
  real empty states and an optional fail-closed Supabase adapter.
- The Expo application and its native dependencies/scripts were removed. The lockfile
  is 454 packages smaller and the remaining workspace passes the production audit.
- `apps/web` has a native App Router manifest, light-only install metadata, same-origin
  lifecycle-only service worker and explicit security/cache headers. The service
  worker does not cache product data or credentials.
- The manifest now includes explicit 192 px, 512 px and maskable 512 px PNG fallbacks
  generated from the committed WhiteRabbit SVG sources. Install UI stores no durable
  state: it responds only to a genuine deferred browser prompt, iOS-like manual
  instructions or standalone detection, and remains absent when unsupported.
- Executable Zod account contracts validate normalized signup, signin and recovery
  inputs plus stable mutation results, including an explicit
  `BACKEND_NOT_CONFIGURED` result that contains no invented user.
- Pure capability-readiness and public-projection policies deny missing backend,
  authentication, deployment, node, policy and model gates with stable reasons.
  Public output additionally requires public classification, non-sensitive movement,
  explicit policy, corroboration and human review.
- The approved Supabase browser/SSR dependencies are pinned. Public configuration is
  validated as absent, invalid or configured; partial, non-HTTPS and malformed values
  fail closed before any client or request can be created.
- A browser-client factory constructs the real Supabase client only after that
  validation succeeds. Absent or invalid configuration returns a typed unavailable
  result, and the committed environment example contains names and safety guidance
  but no values.
- Account services validate before calling the provider, normalize email, call real
  signup/signin/recovery methods when available and map provider/network failures to
  stable non-sensitive results. They neither store passwords nor manufacture sessions.
- The deployed sample operations dashboard has been replaced locally with a polished,
  responsive public landing page whose readiness panel is derived from configuration,
  plus real create-account, sign-in and recovery routes. Submitting without Supabase
  shows the truthful unavailable state and creates no local record.
- Organization onboarding contracts validate the five distinct Belgian controller
  profiles, purpose, deployment label, classification acknowledgement and only the
  ALPR/object baseline capabilities. Biometrics cannot enter through ordinary setup.
- A responsive product workspace now provides the desktop rail and mobile field
  navigation for overview, Sentry, candidates, watchlists, nodes, policies, audit and
  settings. Overview readiness is derived from configuration; every operational route
  renders a truthful empty state rather than a fabricated row, metric or map.
- `/sentry` now provides a real foreground browser-camera permission, preview and stop
  flow. It requests the environment-facing camera only after a user action, keeps the
  stream local, releases tracks on stop/hide/unmount and leaves detection disabled
  while node, policy and model gates are absent.
- After permission, `/sentry` enumerates only real `videoinput` devices and can restart
  the local preview against an exact operator-selected device. An authorized
  capture-zone acknowledgement is visible, session-only, reset on camera stop/switch
  or page hide, and remains insufficient to unlock detection by itself.
- `/app/setup` now exposes the full storage-ready onboarding surface for organization,
  deployment, exact purpose, five controller profiles, ALPR/object baselines and the
  public-SaaS classification acknowledgement. Its submit action is disabled and copy
  explicitly states that typed input is neither submitted nor stored before migrations.
- Request-scoped Supabase server and proxy adapters now use cookies and verified JWT
  claims. `/app` remains available as an explicit unconfigured preview before a
  project exists; once valid Supabase configuration is present, missing/invalid claims
  redirect to sign-in and no server authorization path trusts `getSession()`.
- Verified claim parsing now derives only the minimal workspace display identity:
  subject, normalized email and local-part initials. Missing or malformed claims remain
  unauthenticated and no unverified cookie session object is treated as identity.
- The workspace layout now resolves claims request-by-request when configured, renders
  the verified account email/initials in an accessible account menu and exposes a real
  server-side local-session sign-out. Unconfigured preview still links to sign-in.
- Auth confirmation now has a dynamic token-hash endpoint that accepts only supported
  OTP types and local next paths, exchanges the token through the request-scoped server
  client and strips secrets from success/error redirects. Signup supports an approved
  HTTPS or local-development redirect origin.
- Password-update contracts and Auth services validate a strong matching replacement,
  call the authenticated provider session and return a credential-free
  `PASSWORD_UPDATED` outcome. Missing backend, invalid input and provider failure stay
  within the stable fail-closed result union.
- Account routes now include the recovery-session password-update form, pass the safe
  current origin to signup, and translate only allowlisted callback/proxy reason codes
  into user copy. Unknown query text is never reflected, and unconfigured submission
  continues to return the explicit backend-unavailable result.
- CI now installs the frozen lockfile, verifies peers and formatting, lints,
  typechecks, tests, builds Next.js, audits critical advisories, runs the Python memory
  tests and validates durable memory.
- The `apps/web` monorepo project is connected to the public GitHub repository in
  Vercel with root directory `apps/web`, Node 24 and production branch `main`. The
  first production deployment is available at https://whiterabbit-theta.vercel.app.
- Plan 0003 is active. It rejects runtime fixture adapters and sequences the PWA,
  Auth, onboarding, camera, Supabase and inference work.

## Verification Evidence

```text
python3 -m unittest discover -s tests -v
Ran 9 tests
OK

GitHub Actions run 31695235263
Conclusion: success

GitHub Actions CI run 31695302196
Conclusion: success

GitHub release
https://github.com/sicparvisventures/whiterabbit/releases/tag/v0.1.0-foundation

Planning package commits
7e05fd6, da4d044, a1ee224, cf49c91

GitHub Actions planning-package run 31698879716
Conclusion: success

Interactive mobile prototype
Node syntax checks passed; existing 9 Python tests passed; Playwright click-through passed at 390 px and the sentry view passed at 320 px.

Interactive desktop prototype
Playwright walkthroughs passed at 1024 px, 1280 px, and 1440 px with no page-level horizontal overflow or console errors. Candidate outcomes remain in the desktop context; command-palette, watchlist, node, policy, and audit actions are interactive and synthetic.

Fingerprint regression
The first three prototype CI runs exposed that generated Playwright artifacts were included in local heartbeat fingerprints but absent in clean CI. The artifacts are now excluded from both Git and fingerprinting, with a regression test; the suite contains 10 tests.

GitHub Actions corrective run 31705516125
Conclusion: success

P1 local quality run
Pinned install and peer check passed; Prettier, ESLint and TypeScript passed; 2 Vitest
token-contract tests and 10 Python tests passed; Next.js generated a static production
bundle; Expo exported a 2.3 MB iOS Hermes bundle.

Dependency audit 2026-08-13
No critical advisory. Two high `image-size@2.0.2` parser findings and one moderate
CLI-only `uuid` finding remain in the Expo toolchain; the registry-named image-size
patch is not published. P1 accepts no untrusted native/media input and the finding
blocks operational processing until an Expo-compatible patch is available.

GitHub Actions P1 foundation run 31708721811
Conclusion: success. Frozen install, peers, format, lint, types, tests, Next build,
Expo iOS export, critical audit, Python tests and strict memory validation all passed.
Action dependencies were then updated to immutable Node-24-based v7 release SHAs to
remove the runner's Node 20 deprecation warning.

Vercel production deployment
Project `reserve4you/whiterabbit`, root `apps/web`, production branch `main`; first
deployment completed successfully and the public alias returned the expected
WhiteRabbit Command Center HTML.

Single-PWA checkpoints
Commits `2e5eac8`, `f61ec05` and `8b38968` document the architecture, remove Expo and
add the installable shell. Frozen install, peer validation, production audit, format,
lint, typecheck, tests and Next.js production build passed locally.

Account contract slice
Five Vitest cases, TypeScript and ESLint pass for `@whiterabbit/contracts`; the first
red run failed because the account module did not yet exist, then the minimal schema
implementation made the suite green.

Policy contract slice
Eleven Vitest cases, TypeScript, ESLint and repository formatting pass for
`@whiterabbit/policy`; its red run failed on the intentionally absent capability
module before the fail-closed implementation was added.

Supabase configuration slice
Four Vitest cases, TypeScript, ESLint, formatting and the production dependency audit
pass. The red run failed on the absent configuration module; the implementation now
accepts only a complete HTTPS URL and publishable browser key.

Supabase browser-client slice
Three factory cases pass alongside the configuration suite. The red run failed on the
absent factory; the green implementation creates no client in either unavailable
state and constructs `@supabase/ssr` only from validated browser values.

Account service slice
Six account-service cases pass, including no-provider, invalid-input, real provider
result, generic credential rejection, account-neutral recovery and thrown network
failure. The service suite contains thirteen passing web tests in total.

Public and account UI slice
Next.js prerenders the landing page and all three account modes. Playwright verified
the 390 px and desktop layouts, navigation and the unconfigured signup result with no
browser error; the full pnpm format/lint/type/test/build and ten Python tests pass.

Organization contract slice
Five onboarding tests pass after the expected missing-module red run. They cover
normalization, unknown controller rejection, biometric baseline rejection, mandatory
classification acknowledgement and a storage-missing state with no invented IDs.

Empty product workspace slice
The production build prerenders `/app`, `/app/setup` and eight product destinations.
Playwright verified the 1440 px command center, 390 px field navigation and Operations
empty state without browser errors; the temporary development server was stopped.

Foreground camera slice
Seven camera lifecycle cases pass as part of twenty web tests. The production build
prerenders `/sentry`; Playwright verified the 390 px idle state, explicit permission
request state and disabled detection control. The browser prompt was not granted by
the headless test, and the temporary server was stopped.

Onboarding UI slice
The production build renders `/app/setup` as a dedicated route. Playwright verified
all controller/capability/classification fields, disabled persistence and 390 px
layout with no browser errors; the temporary development server was stopped.

Session protection infrastructure slice
Four access-decision tests pass as part of twenty-four web tests. Next.js detects the
root Proxy, production build passes, and a local production smoke test confirmed that
unconfigured `/app` preview, account routes and the manifest return HTTP 200. The
temporary production server was stopped.

Session identity slice
Three verified-claim parsing tests pass as part of twenty-seven web tests, including
malformed claims and initials that never include the email domain.

Session-aware account menu slice
The full twenty-seven web tests, ESLint (including `proxy.ts`), TypeScript and the
production build pass with conditional identity rendering and server-side sign-out.

Email confirmation slice
Four confirmation parsing tests plus the updated signup redirect assertion pass as
part of thirty-one web tests. The production route table includes dynamic
`/auth/confirm`; lint, types and build pass.

Password update logic slice
Two new contract assertions and one provider-service assertion pass. Contracts expose
twelve tests and the web suite thirty-two; formatting, lint and type checks pass.

Account flow completion slice
The production build exposes dynamic account modes including update-password.
Playwright verified the allowlisted rejected-confirmation copy and 390 px password
update form without browser errors; the temporary development server was stopped.

Single-PWA release checkpoint
Frozen install, production audit (no known vulnerabilities), formatting, ESLint,
TypeScript, 57 Vitest assertions, Next.js production build, ten Python tests and strict
memory validation pass. GitHub Actions run `31722502137` completed successfully for
commit `b1328ae`. Vercel deployment `dpl_J1cqz3wPEaKcyPE7dLvSyFMt1F6a` is Ready and
serves the current public/account PWA through https://whiterabbit-theta.vercel.app.

Camera readiness slice
The expected red run failed four new tests before selectable-camera helpers existed.
The web suite now has 36 passing assertions; ESLint, TypeScript and the Next.js
production build pass. A 390 px Playwright production walkthrough verified the idle
and permission-denied states, disabled session acknowledgement without preview,
readiness diagnostics and zero browser console errors/warnings. The temporary browser
and production server were stopped. Commits `980162e` and `556f58e` are on `main`.

PWA installability slice
The expected red run failed because the install-state module did not exist; seven new
decision/platform assertions now pass as part of 43 web tests. Chrome's current PWA
guidance was checked before adding the 192 px and 512 px raster fallbacks. A 390 px
production walkthrough verified that unsupported state renders no fake action, a
deferred test browser event is prevented and produces an accessible install action,
dismissal hides it, and the console remains clean. ESLint, TypeScript and production
build pass; the temporary browser and server were stopped. Commits `67dc59b` and
`923c845` are on `main`.
```

## Not Yet Implemented

- Supabase project, schema, RLS or persisted organization/deployment data. Auth code is
  complete but cannot perform live mutations before project configuration exists.
- Persistent camera enrollment, browser inference, desktop node packaging, ALPR
  pipeline, review queue or public map.
- Face detection, embedding, watchlist enrollment/sync, matching, biometric alerts, model registry, or iPhone benchmark.
- Production legal assessment, DPIA, controller agreement, retention schedule, security
  risk acceptance/mitigation ownership, or deployment authorization.

## Next Action

Complete the backend-independent node enrollment/input contracts without persistence
or invented identities. After the owner creates Supabase, add migrations, RLS,
generated types and cross-tenant tests before enabling setup persistence. Models and
operational data remain separately gated.
