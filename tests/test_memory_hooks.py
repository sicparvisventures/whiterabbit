from __future__ import annotations

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MEMORY_TOOL_PATH = REPO_ROOT / "scripts" / "memory" / "memory_tool.py"
SESSION_START_PATH = REPO_ROOT / ".codex" / "hooks" / "session_start.py"
STOP_PATH = REPO_ROOT / ".codex" / "hooks" / "stop.py"


def load_memory_tool():
    spec = importlib.util.spec_from_file_location("memory_tool_for_hooks", MEMORY_TOOL_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load memory_tool")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def write_fixture(root: Path) -> None:
    files = {
        "AGENTS.md": "# Agent Instructions\n",
        "BOOTSTRAP.md": "# Bootstrap\n\nRead durable context.\n",
        "HEARTBEAT.md": (
            "# Heartbeat\n\n"
            "- Schema-Version: 1\n"
            "- Last-Updated: 2026-08-13T00:00:00Z\n"
            "- Content-Fingerprint: pending\n"
            "- Status: foundation\n"
        ),
        "memory/INDEX.md": (
            "# Memory Index\n\n"
            "- [Project](PROJECT.md)\n"
            "- [State](STATE.md)\n"
            "- [Backlog](BACKLOG.md)\n"
            "- [Risks](RISKS.md)\n"
        ),
        "memory/PROJECT.md": "# Project Memory\n",
        "memory/STATE.md": "# Current State\n",
        "memory/BACKLOG.md": "# Backlog\n",
        "memory/RISKS.md": "# Risk Register\n",
        "src.txt": "version one\n",
    }
    for relative_path, content in files.items():
        path = root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


def run_hook(path: Path, payload: dict[str, object]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(path)],
        input=json.dumps(payload),
        check=False,
        capture_output=True,
        text=True,
    )


class MemoryHookTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.root = Path(self.temp_dir.name)
        subprocess.run(["git", "init", "-b", "main"], cwd=self.root, check=True, capture_output=True)
        write_fixture(self.root)
        load_memory_tool().checkpoint(self.root, "Fixture is current")

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def test_session_start_injects_bounded_context(self) -> None:
        result = run_hook(
            SESSION_START_PATH,
            {"cwd": str(self.root), "hook_event_name": "SessionStart", "source": "startup"},
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        output = json.loads(result.stdout)
        additional_context = output["hookSpecificOutput"]["additionalContext"]
        self.assertIn("# Bootstrap", additional_context)
        self.assertIn("# Heartbeat", additional_context)
        self.assertIn("# Memory Index", additional_context)

    def test_stop_allows_current_memory(self) -> None:
        result = run_hook(
            STOP_PATH,
            {"cwd": str(self.root), "hook_event_name": "Stop", "stop_hook_active": False},
        )

        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(json.loads(result.stdout), {"continue": True})

    def test_stop_requests_one_repair_turn_for_stale_memory(self) -> None:
        (self.root / "src.txt").write_text("version two\n", encoding="utf-8")

        result = run_hook(
            STOP_PATH,
            {"cwd": str(self.root), "hook_event_name": "Stop", "stop_hook_active": False},
        )

        output = json.loads(result.stdout)
        self.assertEqual(output["decision"], "block")
        self.assertIn("memory_tool.py checkpoint", output["reason"])

    def test_stop_does_not_loop_after_repair_turn(self) -> None:
        (self.root / "src.txt").write_text("version two\n", encoding="utf-8")

        result = run_hook(
            STOP_PATH,
            {"cwd": str(self.root), "hook_event_name": "Stop", "stop_hook_active": True},
        )

        output = json.loads(result.stdout)
        self.assertTrue(output["continue"])
        self.assertIn("still stale", output["systemMessage"])


if __name__ == "__main__":
    unittest.main()
