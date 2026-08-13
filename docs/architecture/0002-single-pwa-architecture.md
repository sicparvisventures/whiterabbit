# Architecture 0002: Single PWA and Supabase Adapter

- Status: active; supersedes Architecture 0001 client/runtime topology
- Date: 2026-08-13
- Applies to: Spec 0005 and the synthetic/non-operational implementation boundary

## Runtime Topology

```text
Browser / installed Home Screen PWA
  ├── public + account routes
  ├── responsive field and command-center routes
  ├── foreground camera session (local MediaStream only)
  └── typed Supabase browser/server clients when configured
             │
             ▼
Supabase Auth + Postgres/RLS + private Storage (future project)
             │
             ▼
separate approved inference/node/event services (future gated adapters)
```

Vercel serves the Next.js application over HTTPS, satisfying the secure-context
requirement for browser camera APIs. The PWA shell does not proxy or upload video.
Frames remain inside the browser unless a later inference adapter explicitly consumes
them under policy. No service worker caches credentials, API responses, evidence or
product routes; its first role is install/update lifecycle and offline shell guidance.
The manifest provides SVG sources plus non-transparent 192 px, 512 px and maskable
512 px PNG fallbacks. A client boundary retains the browser's deferred install event
only in memory, detects standalone mode and renders iOS manual instructions without
claiming a programmable install operation.

## Application Boundaries

### Presentation

App Router route groups compose shared light tokens into mobile bottom navigation and
desktop left navigation. Server Components own request-scoped reads; client components
are limited to forms, install state, browser capability state and camera sessions.

### Domain

`packages/contracts` validates input/output schemas. `packages/policy` makes pure
controller/capability/authority/state decisions. Neither imports Next.js, React,
Supabase, Vercel or browser APIs.

### Provider

`apps/web/lib/supabase` validates public configuration and creates request-scoped
clients. Auth actions expose stable results rather than leaking Supabase errors.
Database repositories follow RLS-scoped interfaces after migrations exist. Missing
configuration is a first-class denied state, not a fixture adapter.

Node enrollment validates a strict application input before any provider call. Tenant,
controller profile, membership and human identity are never accepted as client-granted
scope; the future provider derives them from the authenticated deployment. Missing
persistence returns `STORAGE_NOT_PROVISIONED` without a fabricated node or claim, and
provider output is parsed again before it crosses into the application.

### Camera

The camera component owns one `MediaStream`. It requests `facingMode: environment`,
attaches the stream to one video element, enumerates selectable video devices only
after permission, and calls `stop()` on every track for user stop, device switch,
hidden document, component cleanup or setup failure. A capture-zone acknowledgement
exists only for the visible browser session until an approved persistence boundary
exists. A remote API has no start operation. The state machine distinguishes
unsupported, insecure, idle, requesting, previewing, denied, interrupted and stopped.

## Data and Trust Boundaries

- Public Vercel responses contain source/UI assets and unprivileged configuration
  only. No operational data is hard-coded into bundles.
- Publishable Supabase values identify an API project and are safe for the browser;
  RLS—not key secrecy—must authorize rows.
- Passwords travel from the account form directly through the Supabase Auth client and
  are never logged, persisted by WhiteRabbit or placed in Server Component props.
- Service-role keys, signing keys, model packages and operational endpoints are absent.
- Camera permission and raw frames cross the browser/device boundary only after local
  user consent; no network boundary is crossed by default.

## Deployment

- GitHub `main` triggers Vercel production for `apps/web`.
- Preview branches contain no real operational environment variables unless explicitly
  approved.
- Missing Supabase variables builds successfully and renders setup-required states.
- Once configured, protected reads verify claims server-side and use RLS; client-sent
  organization/deployment identifiers never grant scope.

## Known Constraints

- iOS Home Screen web apps can be installed and can use web capabilities, but camera
  availability/lifecycle remains browser-controlled. There is no locked-screen or
  hidden background capture.
- Web inference and sustained thermal behavior must be benchmarked separately for each
  browser/device/model. No native-attestation or secure-enclave claim exists.
- Reliable multi-device nodes, offline signed events and high-assurance government
  deployments may require a future separately approved edge agent.
