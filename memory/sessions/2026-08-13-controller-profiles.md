# Session Outcome: Belgian Controller Profiles

- Date: 2026-08-13
- Scope: product and data-governance architecture; no surveillance code or cloud resources

## Outcome

- Recorded Belgian Defence as the first intended deployment while keeping WhiteRabbit
  suitable for municipalities and police.
- Drafted Spec 0001 with separate `BE-DEFENCE-ADMIN`,
  `BE-ARMED-FORCES-OPS`, `BE-INTEL`, `BE-POLICE`, and `BE-MUNICIPAL`
  controller profiles.
- Proposed ADR-0004: one controller per deployment, immutable profile, fail-closed
  policy, explicit bridges, and separate edge, restricted, and public planes.
- Replaced uniform government-vehicle publication assumptions with profile-specific
  authorization. Sensitive military and police movements are restricted by default.
- Made Supabase and Vercel conditional deployment adapters rather than defaults for
  restricted, operational, intelligence, or classified processing.

## Research Evidence

- Belgian Defence publishes a DPO contact and describes its controller and security
  responsibilities for the processing in scope of its privacy notice.
- The Belgian Act of 30 July 2018 contains distinct provisions for armed-forces
  deployment/readiness and for intelligence and security services.
- Belgian DPA guidance distinguishes ordinary/municipal camera deployments from
  police camera processing and points to different competent supervisory bodies.
- Belgian DPA guidance and the Royal Decree of 6 December 2018 identify military
  domains as sensitive sites for immediate-perimeter camera rules.

Authoritative links are recorded in Spec 0001. These findings are engineering
inputs and require validation by the accountable authority and qualified counsel.

## Next Verified Action

Obtain project-owner feedback, select the exact non-classified Defence administrative
pilot purpose and accountable service, then seek DPO, legal, security, and operational
review. Do not provision cloud resources or implement real-data flows before those
boundaries are approved.
