# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:31:48Z
- Content-Fingerprint: sha256:95166cc2da984e664230d929e607d81078ac7a70a969998895e48089e5ae2aa4
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: 148754c
- Last-Summary: Baseline candidate and human-review state contracts are test-green; complete repository supply-chain gates next.

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
