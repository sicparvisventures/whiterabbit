#!/usr/bin/env python3
"""Inject WhiteRabbit's bounded durable context when Codex starts or resumes."""

from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "scripts" / "memory"))

import memory_tool  # noqa: E402


def main() -> int:
    payload = json.load(sys.stdin)
    root = memory_tool.find_repository_root(Path(payload.get("cwd", REPO_ROOT)))
    context = memory_tool.bootstrap_context(root, limit=12_000)
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": context,
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
