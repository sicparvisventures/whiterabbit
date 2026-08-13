# ADR-0004: Controller-Scoped Belgian Policy Profiles

- Status: proposed
- Date: 2026-08-13
- Supersedes: ADR-0003 where it implied a uniform government-vehicle public tier

## Context

WhiteRabbit is intended first for Belgian Defence and must also serve municipalities
and police. Those authorities are not one controller and do not share one legal,
oversight, classification, hosting, retention, or publication regime. Military
administration, armed-forces operations, and intelligence processing also require
distinct boundaries.

## Decision

Build one controller-agnostic core with five initial, versioned, fail-closed policy
profiles: `BE-DEFENCE-ADMIN`, `BE-ARMED-FORCES-OPS`, `BE-INTEL`, `BE-POLICE`, and
`BE-MUNICIPAL`.

A deployment has one immutable controller profile. Data cannot silently cross or
merge deployments. Inter-controller exchange requires an explicit, scoped,
revocable, audited bridge approved on both sides.

Separate edge, restricted operational, and public projection planes. Public
eligibility is profile-specific: military, police, investigative, and otherwise
sensitive movement history is restricted by default. Vercel and Supabase remain
candidates only for profiles and classifications whose formal hosting approval
permits them; provider boundaries must allow accredited or self-hosted alternatives.

Belgian Defence is the first pilot under `BE-DEFENCE-ADMIN`, using synthetic or
explicitly approved non-classified data. Operations and intelligence are separate
deployments and are not authorized by this decision.

## Consequences

- ADR-0003's corroboration and human-review requirements remain necessary but are
  no longer sufficient for publication; the active profile must also permit it.
- Policy profile, purpose, version, classification, and deployment identity become
  mandatory event context.
- “Merge groups” is a collaboration concept, not a database merge operation.
- Public and restricted storage cannot share an unrestricted query path.
- Each controller approves its own purpose, DPIA, retention, rights, hosting,
  recipients, bridges, and publication policy before real data is processed.
- The first code target remains a synthetic, non-classified vertical slice.

## Review Gate

This ADR remains proposed until accepted by the project owner and reviewed for the
first deployment by the accountable Belgian public authority, its DPO, security
authority, and qualified counsel.
