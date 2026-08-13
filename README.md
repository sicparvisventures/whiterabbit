# WhiteRabbit

WhiteRabbit is an installable, edge-first PWA for accountable public-sector visual
sensing. It is mobile-first in the field and expands into a dense desktop command
center from the same Next.js, React and TypeScript codebase.

Production preview: https://whiterabbit-theta.vercel.app

## Current status

The public and account experience, installable PWA flow, responsive workspace,
controller-scoped setup/settings surfaces and real foreground browser-camera preview
with post-permission device selection are implemented. Strict node-enrollment contracts
and fail-closed provider services are ready. Supabase is intentionally optional:
without configuration, Auth and data mutations fail closed and operational routes show
verified empty states—never sample users, nodes, plates, faces, events, locations or
metrics.

Once a Supabase project is connected, the existing code activates real email/password
signup, sign-in, recovery, token confirmation, password update, cookie-backed SSR
sessions, verified-claims route protection and sign-out. Database migrations, RLS and
operational persistence will be added only after that project exists.

Detection is not implemented. Camera preview does not claim ALPR, object detection or
biometric identification; those controls remain disabled until exact runtimes, models,
policies and authority gates are approved.

## Product boundaries

- Raw camera streams remain on the device by default.
- One controller profile owns each deployment. Defence, police, municipalities,
  intelligence and armed-forces operations never silently share a tenant or history.
- ALPR and object detection are the baseline capability direction.
- Biometric watchlists are an isolated, tenant-scoped capability requiring separate
  authority, DPIA/FRIA, model review, oversight and accredited hosting.
- One OCR/classifier result can never publish or authorize action. Public projection
  requires policy, corroboration and human review and is off by default.
- Civilian plate histories, raw video, exact private camera positions, credentials and
  biometric data are never public.

Open-source code and camera ownership do not create surveillance authority. Real use
requires an accountable controller, exact statutory purpose, applicable camera
procedure, classification decision, retention, rights process, security approval and
deployment authorization.

## Architecture

```text
Browser / installed PWA
  ├── public and Supabase Auth flows
  ├── mobile field + desktop command-center UI
  ├── foreground local MediaStream preview
  └── typed, fail-closed policy and provider boundaries
                 │
                 ▼
Supabase Auth + Postgres/RLS + private Storage (after project handoff)
                 │
                 ▼
approved edge inference and signed-event adapters (later gated phase)
```

- App: Next.js 16, React 19, TypeScript, Vercel.
- Auth/data candidate: Supabase with request-scoped cookie clients and RLS.
- Shared logic: Zod contracts and pure policy packages.
- PWA camera: secure-context `getUserMedia`, foreground-only, explicit permission,
  tracks released on stop, hide and unmount.
- Restricted deployments: accredited or self-hosted adapters where public cloud is
  not approved.

See [Spec 0005](docs/specs/0005-single-pwa-product.md),
[Architecture 0002](docs/architecture/0002-single-pwa-architecture.md),
[Plan 0003](docs/plans/0003-single-pwa-delivery.md), the
[threat model](docs/security/whiterabbit-threat-model.md) and
[review gates](docs/compliance/0001-review-gates.md).

## Run locally

Use the Node and pnpm versions pinned in `package.json`:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev:web
```

The development URL is normally <http://localhost:3000>. Stop the process when the
session ends. To activate Auth locally, copy `apps/web/.env.example` to a gitignored
`.env.local` and add only the Supabase project URL and publishable key. Never place a
service-role or secret key in a `NEXT_PUBLIC_*` variable.

## Verify

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate --strict
```

## Supabase handoff

When the project is created, provide through approved configuration channels:

1. `NEXT_PUBLIC_SUPABASE_URL`;
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
3. the project reference for CLI linking;
4. approved production and preview callback URLs;
5. confirmation that email/password and email verification are enabled.

Then WhiteRabbit can add versioned migrations, RLS, storage policies, generated types
and cross-tenant negative tests. Follow the exact
[Supabase handoff runbook](docs/deployment/0001-supabase-handoff.md). Do not send
service-role credentials in chat or Git.

## Durable memory

The repository—not hidden chat history—is the resumable project source of truth.
Start with [BOOTSTRAP.md](BOOTSTRAP.md), [HEARTBEAT.md](HEARTBEAT.md) and
[memory/INDEX.md](memory/INDEX.md).

```bash
python3 scripts/memory/memory_tool.py bootstrap
python3 scripts/memory/memory_tool.py checkpoint --summary "Document the outcome and next action"
python3 scripts/memory/memory_tool.py validate --strict
```

Memory stores decisions and verification evidence, never transcripts, credentials,
footage, private locations, civilian plates or identities.

## Upstream and licence

WhiteRabbit is inspired by and may lawfully reuse or adapt code from
[SparrowMap](https://github.com/SparrowMap/sparrowmap). See [NOTICE.md](NOTICE.md).
WhiteRabbit is licensed under GNU AGPL-3.0; network users must receive corresponding
source as required by that licence.

Do not use WhiteRabbit for covert surveillance, untargeted civilian tracking,
unauthorized facial recognition or public person search. Report vulnerabilities via
GitHub private vulnerability reporting; see [SECURITY.md](SECURITY.md).
