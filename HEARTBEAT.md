# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:20:10Z
- Content-Fingerprint: sha256:c621c2b5b958c3fa92c942db183d8b6ba7bda62136d18b8079516726940ca95e
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: d0f139c
- Last-Summary: Pre-Supabase PWA is CI-green and live on Vercel; next owner creates/configures Supabase from the handoff runbook.

## Current Task

Handoff the verified pre-Supabase PWA and wait for the owner-created Supabase project
before applying any migration or enabling persistence.

## Next Verified Action

Follow `docs/deployment/0001-supabase-handoff.md`: receive the project URL, publishable
key, project ref and two Auth confirmations, authenticate the CLI through an approved
secret channel, then implement the first migration/RLS batch test-first.

## Blockers

Supabase provisioning, migrations/RLS, models and real operational data remain gated.
Real surveillance and biometric processing additionally require controller, legal
basis, DPIA/FRIA, model, hosting, security, oversight and operational approvals.
