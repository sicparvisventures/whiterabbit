# ADR-0002: Repository-Native Bounded Memory

- Status: accepted
- Date: 2026-08-13

## Context

Project work must survive separate AI sessions without relying on inaccessible chat history or publishing raw conversations.

## Decision

Use small Markdown sources in version control, a bounded index, deterministic Python validation, a content fingerprint, and repo-local Codex lifecycle hooks. `SessionStart` injects only bootstrap, heartbeat, and index context. `Stop` requests at most one repair turn when memory is missing or stale. `SessionEnd` performs advisory validation.

## Consequences

- Durable decisions and state remain reviewable in Git history.
- Raw transcripts, hidden reasoning, secrets, and operational data are forbidden.
- Hooks never push blindly; publication remains an explicit, validated workflow.
- Changed hooks require user trust review in Codex before execution.
