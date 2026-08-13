# Contributing

WhiteRabbit welcomes contributions that preserve its public-interest, privacy, and open-source boundaries.

## Before You Start

1. Read `AGENTS.md`, `PROJECT_SPEC.md`, and `memory/INDEX.md`.
2. Open an issue before changing architecture, public/private data boundaries, retention, licensing, biometric capabilities, or deployment policy.
3. Use synthetic or deliberately generated fixtures. Never contribute real plates, footage, credentials, or operational locations.

## Development Checks

```bash
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate --strict
```

Write a failing test before implementing logic or behavior. Keep commits small, focused, and attributable. Update durable memory when a change affects current state, decisions, risks, or backlog order.

## Pull Requests

Describe what changed, why it is needed, privacy and abuse implications, verification evidence, and any licence attribution. A feature is not ready when tests pass but its legal, privacy, or operational boundary remains undefined.
