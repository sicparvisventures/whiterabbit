# Notices and Attribution

## SparrowMap

WhiteRabbit is inspired by and may reuse or adapt portions of SparrowMap:

- Project: SparrowMap
- Source: https://github.com/SparrowMap/sparrowmap
- Licence: GNU Affero General Public License, version 3
- Upstream commit used for initial research: `dc78ec9e96d01e074c98338a8bf3de8d28f33578`

SparrowMap, its name, domain, logos, and brand identity are not WhiteRabbit assets. WhiteRabbit is an independent project and does not claim affiliation or endorsement.

When upstream source is copied or adapted, preserve the applicable copyright and licence notices in the relevant files and releases. This notice does not replace file-level attribution or the complete licence text.

## Models and Dependencies

No production model, model weight or dataset has been added to WhiteRabbit. Before
adding one, record its exact source, version, licence, model-card constraints and
corresponding-source obligations.

The current application dependency graph is lockfile-pinned. Its reviewed production
licence families are 0BSD, Apache-2.0, BSD-3-Clause, CC-BY-4.0, ISC,
LGPL-3.0-or-later and MIT. The machine-readable allowlist lives in
`docs/compliance/dependency-policy.json`; CI fails when a new licence expression
appears without review. Tagged releases attach a CycloneDX 1.6 SBOM and checksum.

The LGPL family currently comes from platform-specific libvips binaries used by
Sharp/Next.js image tooling. Recipients must retain the upstream notices and applicable
LGPL rights. This inventory is not a substitute for the licence texts shipped by each
dependency.
