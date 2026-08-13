# ADR-0005: Isolated Tenant-Scoped Biometric Capability

- Status: accepted for synthetic implementation planning; institutional review open
- Date: 2026-08-13
- Depends on: ADR-0004

## Context

WhiteRabbit must retain ALPR and object detection while optionally supporting a
NeoFace Watch-like pattern: local face detection, versioned embeddings, a reference
watchlist, real-time or post-event comparison, candidate alerting, and human review.
This introduces sensitive biometric data, high-risk AI obligations, strict Belgian
controller-specific limits, and severe cross-tenant and false-identification harms.

## Decision

Add biometrics as a separate, opt-in, fail-closed capability rather than expanding
the generic object-event schema. A deployment combines one controller profile with
one explicitly authorized biometric mode: disabled, detection-only, 1:1 verification,
post-event 1:N identification, or real-time 1:N identification.

There is no global watchlist. Watchlists and templates are tenant-, purpose-, model-,
site-, node-, and time-scoped. Small watchlists match locally; larger deployments use
an authority-hosted matching cell. Biometric data has no path to the public projection.

The first implementation target is a synthetic iPhone foreground benchmark in an
Expo/React Native development build using separately approved, permissively licensed
model artifacts. ALPR and object detection continue independently. No real biometric
processing is authorized by this ADR.

## Consequences

- A live signed authority is required before the edge creates an embedding.
- Publicly available photos cannot be scraped or automatically enrolled.
- Results are candidate alerts requiring trained human review, never autonomous
  identity or adverse decisions.
- Municipal 1:N recognition and police real-time public-space recognition remain
  blocked unless a new applicable legal authority and profile review approve them.
- Provider, code, model, weights, datasets, and evaluation licences are reviewed
  separately.
- Government multi-tenancy may require physically separate data-plane cells rather
  than relying on RLS in one shared cloud project.
- The iPhone node is a visible, foreground-only native application. iOS background
  camera capture is neither promised nor designed around.

## Review Gate

The project owner accepted this synthetic planning direction on 2026-08-13. Review
by the first controller, DPO, legal, security, fundamental-rights, model-risk, and
operational authorities remains open. Police use additionally requires the applicable
COC and authorization path; real data remains prohibited until those reviews pass.
