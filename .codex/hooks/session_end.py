#!/usr/bin/env python3
"""Perform a fast advisory memory validation when the main session ends."""

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
    if issues:
        print("; ".join(issues[:5]), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
