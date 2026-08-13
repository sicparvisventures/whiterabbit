# Session Outcome: Biometric Watchlists

- Date: 2026-08-13
- Scope: research, specification, and guardrails; no biometric code, models, cloud resources, or real data

## Outcome

- Kept ALPR and object detection as core WhiteRabbit capabilities.
- Added biometric watchlist identification as an independent, opt-in product direction.
- Drafted Spec 0002 and proposed ADR-0005 with five fail-closed biometric modes,
  tenant/purpose/site/time-scoped watchlists, local matching, candidate alerts, human
  review, no public projection, and authority-specific government data-plane cells.
- Documented a foreground Next.js/React/TypeScript iPhone node, ONNX Runtime Web
  constraints, and a gated native inference fallback.
- Selected permissively licensed OpenCV YuNet and SFace artifacts only as candidates
  for a synthetic benchmark. InsightFace community weights are excluded absent a
  separate production licence.
- Prohibited untargeted face scraping and global or cross-tenant person search.

## Research Evidence

- NEC's public product material confirms the capture, quality, template, watchlist,
  threshold alert, human review, and retention pattern.
- ONNX Runtime documentation currently lists WASM/WebGL but not WebGPU for iOS Safari;
  WebKit has documented PWA camera regressions.
- EU and Belgian sources establish special-category biometric status, DPIA/high-risk
  duties, prohibited untargeted face-database scraping, narrow real-time law-enforcement
  exceptions, and the need for detailed Belgian rules and authorization.
- Belgian police publicly documents specialist post-event facial comparison through
  BIS-FACIAL; this is not treated as authority for arbitrary live watchlists.

## Next Verified Action

The owner must review Specs 0001 and 0002 and select the first synthetic Defence
biometric mode. Then complete the threat model and controller review gates before
planning implementation. No real biometric processing is authorized.
