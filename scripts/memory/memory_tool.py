#!/usr/bin/env python3
"""Validate and load WhiteRabbit's repository-native project memory."""

from __future__ import annotations

import argparse
import hashlib
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable


REQUIRED_FILES = (
    "AGENTS.md",
    "BOOTSTRAP.md",
    "HEARTBEAT.md",
    "memory/INDEX.md",
    "memory/PROJECT.md",
    "memory/STATE.md",
    "memory/BACKLOG.md",
    "memory/RISKS.md",
)

BOOTSTRAP_FILES = ("BOOTSTRAP.md", "HEARTBEAT.md", "memory/INDEX.md")

FINGERPRINT_EXCLUDES = (
    "HEARTBEAT.md",
    "memory/",
    ".codex/runtime/",
    ".playwright-cli/",
    "output/",
)

SECRET_PATTERNS = (
    re.compile(r"gh[pousr]_[A-Za-z0-9]{30,}"),
    re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----"),
    re.compile(r"(?i)(?:service[_-]?role|api[_-]?key|secret)\s*[:=]\s*['\"]?[A-Za-z0-9._-]{24,}"),
)

MARKDOWN_LINK = re.compile(r"\[[^\]]+\]\(([^)]+)\)")
HEARTBEAT_FIELD = re.compile(r"^- ([A-Za-z-]+):\s*(.*)$", re.MULTILINE)


def _run_git(root: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args],
        cwd=root,
        check=False,
        capture_output=True,
        text=True,
    )
    return result.stdout.strip() if result.returncode == 0 else ""


def _project_files(root: Path) -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=root,
        check=False,
        capture_output=True,
    )
    if result.returncode == 0:
        relative_paths = [
            Path(item.decode("utf-8"))
            for item in result.stdout.split(b"\0")
            if item
        ]
    else:
        relative_paths = [path.relative_to(root) for path in root.rglob("*") if path.is_file()]

    files: list[Path] = []
    for relative_path in relative_paths:
        normalized = relative_path.as_posix()
        if normalized == ".git" or normalized.startswith(".git/"):
            continue
        if normalized in FINGERPRINT_EXCLUDES:
            continue
        if any(normalized.startswith(prefix) for prefix in FINGERPRINT_EXCLUDES if prefix.endswith("/")):
            continue
        path = root / relative_path
        if path.is_file():
            files.append(relative_path)
    return sorted(files, key=lambda path: path.as_posix())


def content_fingerprint(root: Path) -> str:
    digest = hashlib.sha256()
    for relative_path in _project_files(root):
        digest.update(relative_path.as_posix().encode("utf-8"))
        digest.update(b"\0")
        with (root / relative_path).open("rb") as project_file:
            while chunk := project_file.read(1024 * 1024):
                digest.update(chunk)
        digest.update(b"\0")
    return f"sha256:{digest.hexdigest()}"


def _heartbeat_fields(content: str) -> dict[str, str]:
    return {match.group(1): match.group(2).strip() for match in HEARTBEAT_FIELD.finditer(content)}


def _managed_memory_files(root: Path) -> Iterable[Path]:
    for relative_path in ("AGENTS.md", "BOOTSTRAP.md", "HEARTBEAT.md", "PROJECT_SPEC.md"):
        path = root / relative_path
        if path.is_file():
            yield path
    memory_root = root / "memory"
    if memory_root.is_dir():
        yield from sorted(memory_root.rglob("*.md"))


def validate_repository(root: Path, strict: bool = False) -> list[str]:
    root = root.resolve()
    issues: list[str] = []

    for relative_path in REQUIRED_FILES:
        path = root / relative_path
        if not path.is_file():
            issues.append(f"missing required file: {relative_path}")
        elif not path.read_text(encoding="utf-8").lstrip().startswith("# "):
            issues.append(f"required file lacks a top-level heading: {relative_path}")

    index_path = root / "memory" / "INDEX.md"
    if index_path.is_file():
        index_content = index_path.read_text(encoding="utf-8")
        for raw_target in MARKDOWN_LINK.findall(index_content):
            target = raw_target.split("#", 1)[0].strip()
            if not target or "://" in target or target.startswith("mailto:"):
                continue
            resolved = (index_path.parent / target).resolve()
            if not resolved.is_relative_to(root) or not resolved.exists():
                display = (index_path.parent / target).relative_to(root).as_posix()
                issues.append(f"memory/INDEX.md links to missing file: {display}")

    for path in _managed_memory_files(root):
        content = path.read_text(encoding="utf-8")
        if any(pattern.search(content) for pattern in SECRET_PATTERNS):
            issues.append(f"possible secret in managed memory: {path.relative_to(root).as_posix()}")

    heartbeat_path = root / "HEARTBEAT.md"
    if heartbeat_path.is_file():
        fields = _heartbeat_fields(heartbeat_path.read_text(encoding="utf-8"))
        for field in ("Schema-Version", "Last-Updated", "Content-Fingerprint", "Status"):
            if not fields.get(field):
                issues.append(f"HEARTBEAT.md missing field: {field}")
        if strict and fields.get("Content-Fingerprint") != content_fingerprint(root):
            issues.append("HEARTBEAT.md is stale for the current project content")

    return sorted(set(issues))


def bootstrap_context(root: Path, limit: int = 12_000) -> str:
    if limit <= 0:
        return ""

    sections: list[str] = []
    for relative_path in BOOTSTRAP_FILES:
        path = root / relative_path
        if path.is_file():
            sections.append(f"<!-- source: {relative_path} -->\n{path.read_text(encoding='utf-8').strip()}")

    encoded = "\n\n".join(sections).encode("utf-8")
    if len(encoded) <= limit:
        return encoded.decode("utf-8")
    return encoded[:limit].decode("utf-8", errors="ignore")


def checkpoint(root: Path, summary: str) -> None:
    heartbeat_path = root / "HEARTBEAT.md"
    if not heartbeat_path.is_file():
        raise FileNotFoundError("HEARTBEAT.md does not exist")

    clean_summary = " ".join(summary.split()).strip()
    if not clean_summary:
        raise ValueError("checkpoint summary must not be empty")
    clean_summary = clean_summary[:200]

    content = heartbeat_path.read_text(encoding="utf-8")
    updates = {
        "Last-Updated": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "Content-Fingerprint": content_fingerprint(root),
        "Branch": _run_git(root, "branch", "--show-current") or "unborn",
        "Commit": _run_git(root, "rev-parse", "--short", "HEAD") or "unborn",
        "Last-Summary": clean_summary,
    }
    for field, value in updates.items():
        pattern = re.compile(rf"^- {re.escape(field)}:.*$", re.MULTILINE)
        replacement = f"- {field}: {value}"
        if pattern.search(content):
            content = pattern.sub(replacement, content, count=1)
        else:
            content = f"{content.rstrip()}\n{replacement}\n"
    heartbeat_path.write_text(content, encoding="utf-8")


def find_repository_root(start: Path) -> Path:
    discovered = _run_git(start.resolve(), "rev-parse", "--show-toplevel")
    return Path(discovered).resolve() if discovered else start.resolve()


def _find_root(explicit_root: str | None) -> Path:
    if explicit_root:
        return Path(explicit_root).resolve()
    return find_repository_root(Path.cwd())


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", help="repository root; defaults to the current Git root")
    subparsers = parser.add_subparsers(dest="command", required=True)

    validate_parser = subparsers.add_parser("validate", help="validate durable memory")
    validate_parser.add_argument("--strict", action="store_true", help="also require a current heartbeat")

    bootstrap_parser = subparsers.add_parser("bootstrap", help="print bounded startup context")
    bootstrap_parser.add_argument("--limit", type=int, default=12_000)

    checkpoint_parser = subparsers.add_parser("checkpoint", help="refresh the heartbeat fingerprint")
    checkpoint_parser.add_argument("--summary", required=True)

    args = parser.parse_args(argv)
    root = _find_root(args.root)

    if args.command == "validate":
        issues = validate_repository(root, strict=args.strict)
        if issues:
            for issue in issues:
                print(f"ERROR: {issue}")
            return 1
        print("memory validation passed")
        return 0
    if args.command == "bootstrap":
        print(bootstrap_context(root, limit=args.limit))
        return 0
    if args.command == "checkpoint":
        checkpoint(root, args.summary)
        print("heartbeat updated")
        return 0
    return 2


if __name__ == "__main__":
    sys.exit(main())
