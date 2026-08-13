# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T17:06:59Z
- Content-Fingerprint: sha256:735892ec6d27b28f98fb58f722235704768d2e4976b2080e7c66defbc7699684
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: 923c845
- Last-Summary: PWA install metadata and guidance are production-verified; next define backend-independent node enrollment contracts before Supabase handoff.

## Current Task

Complete the remaining pre-Supabase PWA work in Plan 0003 without runtime mock data:
typed node-enrollment boundaries, honest adapter contracts and browser checks.

## Next Verified Action

Define the node-enrollment input/result schemas test-first: separate human and device
identity, require deployment/capture-zone binding and return no fabricated identifier
when persistence is unavailable. Then wire only after Supabase RLS exists.

## Blockers

Supabase provisioning, migrations/RLS, models and real operational data remain gated.
Real surveillance and biometric processing additionally require controller, legal
basis, DPIA/FRIA, model, hosting, security, oversight and operational approvals.
