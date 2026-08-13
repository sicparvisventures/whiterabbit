# Heartbeat

- Schema-Version: 1
- Last-Updated: 2026-08-13T16:53:28Z
- Content-Fingerprint: sha256:14ddf24312afd1ae41df7b4a53d461f0e4bd61fe20820a1ded4eaca8328e7726
- Status: light-only-p1-foundation-in-progress
- Branch: main
- Commit: a087302
- Last-Summary: PWA/Auth/onboarding/camera foundation is live and CI-green; next complete camera-node readiness and install guidance before Supabase handoff.

## Current Task

Complete the remaining pre-Supabase PWA work in Plan 0003 without runtime mock data:
camera-node readiness, install guidance, honest adapter boundaries and browser checks.

## Next Verified Action

Implement Plan 0003 Phase 4 step 3 test-first: capture-zone acknowledgement, real
camera enumeration/selection after permission and readiness diagnostics. Then verify
the production PWA and document the Supabase handoff boundary.

## Blockers

Supabase provisioning, migrations/RLS, models and real operational data remain gated.
Real surveillance and biometric processing additionally require controller, legal
basis, DPIA/FRIA, model, hosting, security, oversight and operational approvals.
