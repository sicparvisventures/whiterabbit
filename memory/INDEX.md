# Memory Index

Load this bounded index at session start. Open only the files required for the active task.

## Core Context

- [Project vision, users, vocabulary, and non-goals](PROJECT.md)
- [Current implementation state and evidence](STATE.md)
- [Ordered backlog with acceptance criteria](BACKLOG.md)
- [Legal, privacy, security, product, and operational risks](RISKS.md)

## Decisions

Architecture decisions are immutable records; supersede an ADR with a new ADR rather than rewriting history.

- [ADR-0001: Reuse SparrowMap under AGPL-3.0](decisions/ADR-0001-agpl-upstream.md)
- [ADR-0002: Repository-native bounded memory](decisions/ADR-0002-repository-memory.md)
- [ADR-0003: Corroborated government-vehicle public tier](decisions/ADR-0003-public-data-boundary.md)
- [ADR-0004: Controller-scoped Belgian policy profiles](decisions/ADR-0004-controller-policy-profiles.md)
- [ADR-0005: Isolated tenant-scoped biometric capability](decisions/ADR-0005-isolated-biometric-capability.md)

## Active Specifications

- [Spec 0001: Belgian controller profiles](../docs/specs/0001-belgian-controller-profiles.md)
- [Spec 0002: Tenant-scoped biometric watchlists](../docs/specs/0002-biometric-watchlists.md)

## Research

- [Research 0001: Biometric watchlist options](../docs/research/0001-biometric-watchlist-options.md)

## Session Outcomes

Concise session outcomes live in `memory/sessions/`. They contain decisions and verification evidence, never raw transcripts or secrets.

## Working Rule

If memory and code disagree, stop, inspect the evidence, and update the incorrect source before continuing.
