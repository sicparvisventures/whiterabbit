#!/usr/bin/env python3
from __future__ import annotations

import argparse
import base64
import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any


REPO_ROOT = Path(__file__).resolve().parents[2]
POLICY_PATH = REPO_ROOT / "docs" / "compliance" / "dependency-policy.json"

SENSITIVE_ASSIGNMENT = re.compile(
    r"^\s*(?:export\s+)?(?:"
    r"SUPABASE_SERVICE_ROLE_KEY|SERVICE_ROLE_KEY|DATABASE_URL|POSTGRES_URL|"
    r"POSTGRES_PASSWORD|VERCEL_TOKEN|GITHUB_TOKEN|GH_TOKEN|"
    r"AWS_SECRET_ACCESS_KEY|PRIVATE_KEY"
    r")\s*[:=]\s*(.*?)\s*$",
    re.IGNORECASE,
)
PRIVATE_KEY_MARKER = re.compile(
    "-----BEGIN " + r"(?:RSA |EC |OPENSSH )?" + "PRIVATE KEY-----"
)
KNOWN_TOKEN_PATTERNS = (
    re.compile("gh" + r"[opusr]_[A-Za-z0-9]{30,}"),
    re.compile("github" + r"_pat_[A-Za-z0-9_]{40,}"),
    re.compile("sb" + r"_secret_[A-Za-z0-9_-]{20,}"),
    re.compile(r"AKIA[0-9A-Z]{16}"),
)
JWT_PATTERN = re.compile(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]+\b")


def _is_placeholder(value: str) -> bool:
    normalized = value.strip().strip("\"'").strip()
    return (
        not normalized
        or (normalized.startswith("<") and normalized.endswith(">"))
        or (normalized.startswith("${") and normalized.endswith("}"))
    )


def _jwt_has_service_role(token: str) -> bool:
    try:
        payload = token.split(".", maxsplit=2)[1]
        padding = "=" * (-len(payload) % 4)
        decoded = json.loads(base64.urlsafe_b64decode(payload + padding))
    except (ValueError, UnicodeDecodeError, json.JSONDecodeError):
        return False
    return isinstance(decoded, dict) and decoded.get("role") == "service_role"


def scan_text(path: Path, text: str) -> list[str]:
    issues: list[str] = []
    for line_number, line in enumerate(text.splitlines(), start=1):
        assignment = SENSITIVE_ASSIGNMENT.match(line)
        if assignment and not _is_placeholder(assignment.group(1)):
            issues.append(f"{path.as_posix()}:{line_number}: sensitive assignment")

        if PRIVATE_KEY_MARKER.search(line):
            issues.append(f"{path.as_posix()}:{line_number}: private key material")

        if any(pattern.search(line) for pattern in KNOWN_TOKEN_PATTERNS):
            issues.append(f"{path.as_posix()}:{line_number}: credential-like token")

        if any(_jwt_has_service_role(token) for token in JWT_PATTERN.findall(line)):
            issues.append(f"{path.as_posix()}:{line_number}: service-role JWT")
    return issues


def _tracked_paths(root: Path) -> list[Path]:
    result = subprocess.run(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard", "-z"],
        cwd=root,
        check=True,
        capture_output=True,
    )
    return [root / item.decode("utf-8") for item in result.stdout.split(b"\0") if item]


def scan_repository(root: Path) -> list[str]:
    issues: list[str] = []
    for path in _tracked_paths(root):
        if not path.is_file() or path.stat().st_size > 5_000_000:
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        issues.extend(scan_text(path.relative_to(root), text))
    return issues


def validate_license_inventory(
    inventory: dict[str, Any], approved_licenses: set[str]
) -> list[str]:
    issues: list[str] = []
    for license_expression, packages in inventory.items():
        if license_expression not in approved_licenses:
            issues.append(f"unreviewed licence expression: {license_expression}")
        if not isinstance(packages, list) or not packages:
            issues.append(f"licence {license_expression} has no package entries")
            continue
        for package in packages:
            name = package.get("name") if isinstance(package, dict) else None
            versions = package.get("versions") if isinstance(package, dict) else None
            if not isinstance(name, str) or not name:
                issues.append(f"licence {license_expression} has a package without a name")
            if not isinstance(versions, list) or not versions:
                issues.append(
                    f"licence {license_expression} package {name or '<unknown>'} is missing version"
                )
    if not inventory:
        issues.append("production licence inventory is empty")
    return issues


def _root_license_ids(sbom: dict[str, Any]) -> set[str]:
    component = sbom.get("metadata", {}).get("component", {})
    licenses = component.get("licenses", []) if isinstance(component, dict) else []
    return {
        identifier
        for item in licenses
        if isinstance(item, dict)
        for identifier in [item.get("license", {}).get("id")]
        if isinstance(identifier, str)
    }


def validate_sbom(sbom: dict[str, Any], expected_root_license: str) -> list[str]:
    issues: list[str] = []
    if sbom.get("bomFormat") != "CycloneDX" or sbom.get("specVersion") != "1.6":
        issues.append("SBOM must be CycloneDX 1.6")
    if expected_root_license not in _root_license_ids(sbom):
        issues.append(f"SBOM root licence must include {expected_root_license}")

    components = sbom.get("components")
    if not isinstance(components, list) or not components:
        issues.append("SBOM has no dependency components")
    else:
        seen_refs: set[str] = set()
        for component in components:
            if not isinstance(component, dict):
                issues.append("SBOM contains a malformed component")
                continue
            if not all(component.get(field) for field in ("name", "version", "purl", "bom-ref")):
                issues.append("SBOM component is missing name, version, purl or bom-ref")
            bom_ref = component.get("bom-ref")
            if isinstance(bom_ref, str):
                if bom_ref in seen_refs:
                    issues.append(f"SBOM contains duplicate component reference: {bom_ref}")
                seen_refs.add(bom_ref)

    dependencies = sbom.get("dependencies")
    if not isinstance(dependencies, list) or not dependencies:
        issues.append("SBOM has no dependency graph")
    return issues


def _run_json(command: list[str], root: Path) -> dict[str, Any]:
    result = subprocess.run(command, cwd=root, check=True, capture_output=True, text=True)
    parsed = json.loads(result.stdout)
    if not isinstance(parsed, dict):
        raise ValueError("command returned a non-object JSON document")
    return parsed


def _load_policy(path: Path) -> dict[str, Any]:
    parsed = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(parsed, dict):
        raise ValueError("dependency policy must be a JSON object")
    return parsed


def run_checks(root: Path, policy_path: Path) -> list[str]:
    issues = scan_repository(root)
    policy = _load_policy(policy_path)
    root_license = policy.get("rootLicense")
    approved = policy.get("approvedProductionLicenseExpressions")
    if not isinstance(root_license, str) or not root_license:
        return [*issues, "dependency policy has no rootLicense"]
    if not isinstance(approved, list) or not all(isinstance(item, str) for item in approved):
        return [*issues, "dependency policy has no approved licence list"]

    licenses = _run_json(
        ["corepack", "pnpm", "licenses", "list", "--prod", "--json"], root
    )
    issues.extend(validate_license_inventory(licenses, set(approved)))

    sbom = _run_json(
        [
            "corepack",
            "pnpm",
            "sbom",
            "--sbom-format",
            "cyclonedx",
            "--sbom-spec-version",
            "1.6",
            "--prod",
            "--lockfile-only",
        ],
        root,
    )
    issues.extend(validate_sbom(sbom, root_license))
    return issues


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate source and dependency supply chain")
    parser.add_argument("--root", type=Path, default=REPO_ROOT)
    parser.add_argument("--policy", type=Path, default=POLICY_PATH)
    args = parser.parse_args()

    try:
        issues = run_checks(args.root.resolve(), args.policy.resolve())
    except (OSError, ValueError, subprocess.CalledProcessError) as error:
        print(f"supply-chain validation failed to run: {error}", file=sys.stderr)
        return 2

    if issues:
        for issue in issues:
            print(f"ERROR: {issue}", file=sys.stderr)
        return 1
    print("supply-chain validation passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
