# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:38:02Z
- Content-Fingerprint: sha256:6dc989ff95d5aa78e8e0f66be922b19dc82084aa275d48d5b09ee0053b7c6538
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: 32545ee
- Last-Summary: Supply-chain gates are wired into CI and tag releases attach an SBOM/checksum; confirm the remote CI run next.

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
