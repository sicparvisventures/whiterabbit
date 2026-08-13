# ADR-0001: Reuse SparrowMap Under AGPL-3.0

- Status: accepted
- Date: 2026-08-13

## Context

SparrowMap already contains browser and desktop camera paths, local inference, signed nodes, redaction, government-vehicle classification, review, retention, and a public map. WhiteRabbit intends to adapt useful code and patterns rather than evade the upstream licence through “reverse engineering.”

## Decision

WhiteRabbit is public and AGPL-3.0-compatible. Reused or adapted SparrowMap code retains required notices and is documented in `NOTICE.md`. WhiteRabbit uses its own name, assets, deployment architecture, and product identity.

## Consequences

- Network users must be offered corresponding source as required by AGPL-3.0.
- Dependency and model licences must be inventoried before release.
- Proprietary relicensing is not an assumed option.
- The ignored local upstream checkout remains a research reference, not a vendored dependency.
