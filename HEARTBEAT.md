# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:29:49Z
- Content-Fingerprint: sha256:f12748d7135623e844ac719439a0dc0c9155116365eea571f97b1a807119922d
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: 11a0a93
- Last-Summary: Minimized signed ALPR/object envelopes are test-green and evidence stays denied; implement candidate review-state contracts next.

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
