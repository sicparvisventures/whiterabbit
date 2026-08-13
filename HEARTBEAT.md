# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:36:01Z
- Content-Fingerprint: sha256:e6c1ffe31735cee300028baf59b89709abc2685f69a91725e67b67df1198cf06
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: d968028
- Last-Summary: Repository secret, reviewed-licence and CycloneDX validators are test-green; wire them into CI and release next.

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
