from __future__ import annotations

import importlib.util
import subprocess
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = REPO_ROOT / "scripts" / "memory" / "memory_tool.py"


def load_memory_tool():
    spec = importlib.util.spec_from_file_location("memory_tool", MODULE_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load memory_tool")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def write_minimal_memory(root: Path) -> None:
    files = {
        "AGENTS.md": "# Agent Instructions\n",
        "BOOTSTRAP.md": "# Bootstrap\n",
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
    }
    for relative_path, content in files.items():
        path = root / relative_path
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")


class MemoryValidationTests(unittest.TestCase):
    def test_reports_missing_required_files(self) -> None:
        memory_tool = load_memory_tool()

        with tempfile.TemporaryDirectory() as temp_dir:
            issues = memory_tool.validate_repository(Path(temp_dir), strict=False)

        self.assertTrue(any("missing required file" in issue for issue in issues))

    def test_reports_broken_index_links(self) -> None:
        memory_tool = load_memory_tool()

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            write_minimal_memory(root)
            (root / "memory" / "INDEX.md").write_text(
                "# Memory Index\n\n- [Missing](DOES_NOT_EXIST.md)\n",
                encoding="utf-8",
            )

            issues = memory_tool.validate_repository(root, strict=False)

        self.assertIn("memory/INDEX.md links to missing file: memory/DOES_NOT_EXIST.md", issues)

    def test_rejects_secrets_in_memory_files(self) -> None:
        memory_tool = load_memory_tool()

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            write_minimal_memory(root)
            (root / "memory" / "STATE.md").write_text(
                "# Current State\n\nghp_abcdefghijklmnopqrstuvwxyz1234567890\n",
                encoding="utf-8",
            )

            issues = memory_tool.validate_repository(root, strict=False)

        self.assertTrue(any("possible secret" in issue for issue in issues))

    def test_checkpoint_makes_strict_validation_current(self) -> None:
        memory_tool = load_memory_tool()

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            subprocess.run(["git", "init", "-b", "main"], cwd=root, check=True, capture_output=True)
            write_minimal_memory(root)
            (root / "src.txt").write_text("version one\n", encoding="utf-8")

            memory_tool.checkpoint(root, "Initial state")
            self.assertEqual(memory_tool.validate_repository(root, strict=True), [])

            (root / "src.txt").write_text("version two\n", encoding="utf-8")
            issues = memory_tool.validate_repository(root, strict=True)

        self.assertIn("HEARTBEAT.md is stale for the current project content", issues)

    def test_bootstrap_is_bounded_and_excludes_session_logs(self) -> None:
        memory_tool = load_memory_tool()

        with tempfile.TemporaryDirectory() as temp_dir:
            root = Path(temp_dir)
            write_minimal_memory(root)
            session_path = root / "memory" / "sessions" / "private.md"
            session_path.parent.mkdir(parents=True)
            session_path.write_text("DO NOT LOAD THIS SESSION", encoding="utf-8")

            output = memory_tool.bootstrap_context(root, limit=10_000)

        self.assertIn("# Bootstrap", output)
        self.assertIn("# Heartbeat", output)
        self.assertIn("# Memory Index", output)
        self.assertNotIn("DO NOT LOAD THIS SESSION", output)
        self.assertLessEqual(len(output.encode("utf-8")), 10_000)


if __name__ == "__main__":
    unittest.main()
