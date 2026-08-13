from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = REPO_ROOT / "scripts" / "quality" / "supply_chain.py"


def load_supply_chain():
    spec = importlib.util.spec_from_file_location("supply_chain", MODULE_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError("could not load supply_chain")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class SecretScanTests(unittest.TestCase):
    def test_reports_high_risk_secret_assignments_without_echoing_values(self) -> None:
        supply_chain = load_supply_chain()
        variable = "SUPABASE_" + "SERVICE_ROLE_KEY"
        secret = "sensitive-value-that-must-never-be-printed"

        issues = supply_chain.scan_text(
            Path("config.env"), f"{variable}={secret}\n"
        )

        self.assertEqual(len(issues), 1)
        self.assertIn("config.env:1", issues[0])
        self.assertNotIn(secret, issues[0])

    def test_reports_private_key_material(self) -> None:
        supply_chain = load_supply_chain()
        marker = "-----BEGIN " + "PRIVATE KEY-----"

        issues = supply_chain.scan_text(Path("key.pem"), marker)

        self.assertEqual(len(issues), 1)
        self.assertIn("private key material", issues[0])

    def test_allows_empty_or_documented_placeholder_values(self) -> None:
        supply_chain = load_supply_chain()
        variable = "SUPABASE_" + "SERVICE_ROLE_KEY"

        self.assertEqual(
            supply_chain.scan_text(
                Path(".env.example"), f'{variable}=""\nDATABASE_URL=<secret-manager>\n'
            ),
            [],
        )


class LicenseInventoryTests(unittest.TestCase):
    def test_accepts_reviewed_license_families(self) -> None:
        supply_chain = load_supply_chain()
        inventory = {
            "MIT": [{"name": "example", "versions": ["1.0.0"]}],
            "Apache-2.0": [{"name": "example-two", "versions": ["2.0.0"]}],
        }

        issues = supply_chain.validate_license_inventory(
            inventory, {"MIT", "Apache-2.0"}
        )

        self.assertEqual(issues, [])

    def test_rejects_unreviewed_or_incomplete_license_entries(self) -> None:
        supply_chain = load_supply_chain()
        inventory = {
            "UNKNOWN": [{"name": "mystery", "versions": []}],
        }

        issues = supply_chain.validate_license_inventory(inventory, {"MIT"})

        self.assertTrue(any("unreviewed licence" in issue for issue in issues))
        self.assertTrue(any("missing version" in issue for issue in issues))


class SbomTests(unittest.TestCase):
    def test_accepts_a_versioned_cyclonedx_inventory_with_dependency_graph(self) -> None:
        supply_chain = load_supply_chain()
        sbom = {
            "bomFormat": "CycloneDX",
            "specVersion": "1.6",
            "metadata": {
                "component": {
                    "name": "whiterabbit",
                    "version": "0.2.0",
                    "licenses": [{"license": {"id": "AGPL-3.0-only"}}],
                }
            },
            "components": [
                {
                    "name": "example",
                    "version": "1.0.0",
                    "purl": "pkg:npm/example@1.0.0",
                    "bom-ref": "pkg:npm/example@1.0.0",
                }
            ],
            "dependencies": [
                {
                    "ref": "pkg:npm/whiterabbit@0.2.0",
                    "dependsOn": ["pkg:npm/example@1.0.0"],
                }
            ],
        }

        issues = supply_chain.validate_sbom(sbom, "AGPL-3.0-only")

        self.assertEqual(issues, [])

    def test_rejects_missing_components_and_wrong_root_license(self) -> None:
        supply_chain = load_supply_chain()
        sbom = {
            "bomFormat": "CycloneDX",
            "specVersion": "1.6",
            "metadata": {
                "component": {
                    "name": "whiterabbit",
                    "version": "0.2.0",
                    "licenses": [{"license": {"id": "MIT"}}],
                }
            },
            "components": [],
            "dependencies": [],
        }

        issues = supply_chain.validate_sbom(sbom, "AGPL-3.0-only")

        self.assertTrue(any("root licence" in issue for issue in issues))
        self.assertTrue(any("no dependency components" in issue for issue in issues))
        self.assertTrue(any("no dependency graph" in issue for issue in issues))


if __name__ == "__main__":
    unittest.main()
