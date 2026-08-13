#!/usr/bin/env python3
"""Require current durable memory before a Codex turn is allowed to stop."""

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
    issues = memory_tool.validate_repository(root, strict=True)
    if not issues:
        print(json.dumps({"continue": True}))
        return 0

    issue_text = "; ".join(issues[:5])
    if payload.get("stop_hook_active"):
        print(
            json.dumps(
                {
                    "continue": True,
                    "systemMessage": (
                        "WhiteRabbit memory is still stale after the repair turn: "
                        f"{issue_text}"
                    ),
                }
            )
        )
        return 0


    print(
        json.dumps(
            {
                "decision": "block",
                "reason": (
                    "Update the relevant files in memory/, then run "
                    "`python3 scripts/memory/memory_tool.py checkpoint "
                    "--summary \"<concise outcome and next action>\"` and "
                    "`python3 scripts/memory/memory_tool.py validate --strict` "
                    f"before stopping. Current issues: {issue_text}"
                ),
            }
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
