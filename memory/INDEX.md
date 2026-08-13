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

## Session Outcomes

Concise session outcomes live in `memory/sessions/`. They contain decisions and verification evidence, never raw transcripts or secrets.

## Working Rule

If memory and code disagree, stop, inspect the evidence, and update the incorrect source before continuing.
