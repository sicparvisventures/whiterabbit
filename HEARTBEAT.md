# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:26:21Z
- Content-Fingerprint: sha256:ab57c6d081e91db6bcb4acd5918339cc7b5697d6b5b15fa8bb2ffa8acb252684
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: 74fbb6c
- Last-Summary: Baseline signed-event header and ES256 signature contracts are test-green; implement minimal ALPR/object payload envelopes next.

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
