# Current State

## Checkpoint

Date: 2026-08-13

The WhiteRabbit repository is public at https://github.com/sicparvisventures/whiterabbit on branch `main` with repository-local author `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.

The SparrowMap upstream is available as an ignored, clean research checkout in `sparrowmap/` at commit `dc78ec9e96d01e074c98338a8bf3de8d28f33578`, tag `v0.1.0`. It is not vendored into WhiteRabbit.

## Approved Direction

- Public, English-language, AGPL-3.0-compatible project named WhiteRabbit.
- Belgian public-sector ALPR is the initial product direction.
- Belgian Defence is the first intended deployment; municipalities and police must be supported as separate controller profiles.
- Government-vehicle detections may become public only when the controller profile permits it, after corroboration and human review. Military, police, investigative, and other sensitive movements are restricted by default.
- SparrowMap code may be reused lawfully with attribution.
- Person and object data are potential OSINT inputs, but identifying or persistent person tracking is not approved for implementation.
- ALPR and object detection remain core. A tenant-scoped biometric watchlist is an additional approved product direction, with implementation and all real biometric processing still gated by Spec 0002, legal authority, DPIA/FRIA, threat model, model review, and controller approval.
- The mobile client is an Expo/React Native development build for iPhone-first edge and field workflows. The desktop command center is Next.js. Supabase Auth email/password is the phase-1 human login; privileged roles require MFA `aal2`, while nodes use separate revocable device identities. SSO is deferred.
- Supabase and Vercel are candidates for approved non-sensitive profiles. Restricted, operational, intelligence, or classified profiles require an accredited or self-hosted topology; nothing has been provisioned.
- Frequent atomic pushes are approved after validation.

## Implemented

- Repository-native memory validator and bounded bootstrap tool.
- Content fingerprinting that detects stale heartbeat state.
- Secret scanning for managed memory files.
- Codex `SessionStart`, `Stop`, and `SessionEnd` hooks.
- Stop-hook loop prevention.
- Nine unit/integration tests covering the memory tool and hooks.
- Public GitHub repository and protected source history.
- GitHub Actions CI for tests and strict memory validation.
- Tagged foundation release `v0.1.0-foundation`.
- Owner-approved synthetic-planning Belgian controller-profile specification and ADR-0004 covering Defence administration, armed-forces operations, intelligence, police, and municipalities.
- Owner-approved synthetic-planning biometric-watchlist specification and ADR-0005 defining isolated modes, scoped watchlists, local matching, human review, and government data-plane cells.
- ADR-0006 selecting Expo/React Native mobile, Next.js desktop, Supabase Auth without SSO in phase 1, and separate node identities.
- Spec 0003 fixes the first executable boundary at one fictional `BE-DEFENCE-ADMIN` site, 1–10 iPhone nodes, synthetic ALPR/objects, a maximum 1,000-identity synthetic real-time 1:N benchmark, 24-hour candidate evidence, no public projection, and no federation.
- Architecture 0001 defines the planned mobile edge, web command center, provider boundaries, separate human/node identity, edge pipeline, storage domains, and deployment topologies.
- Product Experience 0001 defines a native iOS 26 field instrument and an accessible, premium, information-dense desktop command center without copying third-party trade dress.
- Spec 0004 defines versioned signed node events, canonical ES256 event/request proofs, monotonic anti-replay context, distinct ALPR/object/biometric payloads, stable REST resources, authorization, idempotency, concurrency, error, and contract-test rules.
- The repository-grounded threat model identifies cross-tenant access, watchlist abuse, supply-chain substitution, node compromise, false biometric escalation, retention leakage, public projection, account compromise, denial of service, unsafe parsers, federation, and public-repo leakage. Runtime controls are explicitly unimplemented.
- Compliance 0001 defines profile routing and gates for product scope, provenance, legal authority, DPIA/FRIA/AI classification, security/hosting, model/device validation, human procedure, real pilot, scale, publication, and federation.
- Plan 0001 sequences the synthetic product into phases P1–P11 with dependency batches, test-first tasks, five-file implementation limits, acceptance evidence, atomic pushes, and explicit stop conditions.
- A dependency-free interactive prototype now covers the complete mobile field flow plus a desktop command center with overview, synchronized operations workspace, candidate review, governed watchlists, node health, effective policy, audit stream, density controls, and a keyboard command palette. It is demonstrative only: no camera, inference, network, identity, or backend capability is present.
- Product Experience 0002 and the prototype README record the review routes, interaction inventory, responsive evidence, accessibility limits, non-capabilities, and the owner approval checklist.

## Verification Evidence

```text
python3 -m unittest discover -s tests -v
Ran 9 tests
OK

GitHub Actions run 31695235263
Conclusion: success

GitHub Actions CI run 31695302196
Conclusion: success

GitHub release
https://github.com/sicparvisventures/whiterabbit/releases/tag/v0.1.0-foundation

Planning package commits
7e05fd6, da4d044, a1ee224, cf49c91

GitHub Actions planning-package run 31698879716
Conclusion: success

Interactive mobile prototype
Node syntax checks passed; existing 9 Python tests passed; Playwright click-through passed at 390 px and the sentry view passed at 320 px.

Interactive desktop prototype
Playwright walkthroughs passed at 1024 px, 1280 px, and 1440 px with no page-level horizontal overflow or console errors. Candidate outcomes remain in the desktop context; command-palette, watchlist, node, policy, and audit actions are interactive and synthetic.

Fingerprint regression
The first three prototype CI runs exposed that generated Playwright artifacts were included in local heartbeat fingerprints but absent in clean CI. The artifacts are now excluded from both Git and fingerprinting, with a regression test; the suite contains 10 tests.

GitHub Actions corrective run 31705516125
Conclusion: success
```

## Not Yet Implemented

- Web application, Supabase project, schema, RLS, or Vercel project.
- Camera enrollment, native mobile inference, desktop node, ALPR pipeline, review queue, or public map.
- Face detection, embedding, watchlist enrollment/sync, matching, biometric alerts, model registry, or iPhone benchmark.
- Production legal assessment, DPIA, controller agreement, retention schedule, security
  risk acceptance/mitigation ownership, or deployment authorization.

## Next Action

Request owner approval or revision of the combined mobile/desktop experience using
Product Experience 0002. Product implementation, dependency batch D1, cloud
provisioning, model artifacts, camera access, and real data remain paused until
explicit approval.
