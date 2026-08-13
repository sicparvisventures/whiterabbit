# ADR-0007: Light-Only Product and Foundation Dependencies

- Status: accepted for synthetic implementation
- Date: 2026-08-13
- Depends on: ADR-0006

## Context

The interactive prototype validated the mobile and desktop information architecture.
Owner review also rejected dark and system-selectable themes: WhiteRabbit must present
one calm, high-contrast light interface on mobile and desktop. The first implementation
phase now needs a deterministic TypeScript workspace without implying that camera,
inference, identity, cloud, or government deployment controls already exist.

## Decision

WhiteRabbit has one product theme: light. There is no runtime theme selector, no dark
token set, and no automatic system-theme switch. Dark image, video, or map content may
appear inside an opaque bounded viewport when that improves the source material, but
the application shell, navigation, panels, forms, tables, and dialogs remain light.

Dependency batch D1 is approved for incremental synthetic implementation with these
initial pins:

| Component | Version | Upstream | Licence | Use |
| --- | --- | --- | --- | --- |
| Node.js | `24.18.0` | nodejs/node | MIT | CI and release baseline |
| pnpm | `11.21.0` | pnpm/pnpm | MIT | workspace and lockfile |
| TypeScript | `5.9.3` | microsoft/TypeScript | Apache-2.0 | static contracts |
| Vitest | `4.1.10` | vitest-dev/vitest | MIT | TypeScript unit tests |
| ESLint | `9.39.5` | eslint/eslint | MIT | supported lint baseline |
| ESLint JavaScript config | `9.39.5` | eslint/js | MIT | baseline JavaScript rules |
| TypeScript ESLint | `8.67.0` | typescript-eslint/typescript-eslint | MIT | TypeScript lint parser and rules |
| Prettier | `3.9.6` | prettier/prettier | MIT | deterministic formatting |
| Zod | `4.4.3` | colinhacks/zod | MIT | runtime schema validation |
| Next.js | `16.3.0` | vercel/next.js | MIT | current stable web shell; selected after audit of 16.2.11 transitive pins |
| React / React DOM (web) | `19.2.8` | facebook/react | MIT | web UI runtime |
| Expo | `57.0.12` | expo/expo | MIT | managed native toolchain |
| React Native | `0.86.2` | facebook/react-native | MIT | Expo SDK 57 native runtime |
| React (mobile) | `19.2.3` | facebook/react | MIT | Expo SDK 57 compatibility |
| Expo Router | `57.0.12` | expo/expo | MIT | file-based mobile navigation |
| React Native supporting peers | Expo SDK 57 template pins | Expo and React Native upstreams | MIT | deterministic Metro/router compatibility |
| Expo development client | `57.0.11` | expo/expo | MIT | future native-module builds |
| Expo Camera | `57.0.3` | expo/expo | MIT | future explicit Sentry camera boundary |
| Supabase JavaScript | `2.112.3` | supabase/supabase-js | MIT | future Auth/data client |
| Supabase SSR | `0.12.4` | supabase/ssr | MIT | future server session adapter |

Only dependencies needed by the current slice are installed. Approval of this list is
not approval of all transitive packages, native behavior, hosted services, or future
upgrades. The lockfile is authoritative for exact transitive versions and is reviewed
with each dependency-changing commit.

## Supply-Chain Conditions

- Use exact direct dependency versions; Expo compatibility packages may be adjusted
  only after `expo install --check` evidence.
- Keep lifecycle scripts disabled unless an identified package requires an explicitly
  reviewed exception.
- CI uses Node `24.18.0`; local Node 26 is tolerated only as a development convenience.
- Dependency changes require a lockfile diff, licence and vulnerability review, SBOM
  delta, build impact, and rollback note.
- No model, weight, dataset, real identity, camera feed, cloud project, credential, or
  operational endpoint is authorized by this ADR.

Initial audit note: Next.js `16.2.11` was replaced before merge because its fixed
`postcss` and optional `sharp` lines were reported vulnerable on 2026-08-13. Expo SDK
57 currently resolves `image-size@2.0.2`, for which the audit registry reports a high
severity denial-of-service issue while naming an unpublished `2.0.3` fix, plus a
moderate CLI-only `uuid` issue. Those parsers receive no remote or user-controlled
input in P1. The finding remains open and blocks operational/native input processing;
upgrade to the Expo-supported patch as soon as it exists rather than forcing an
unsupported transitive override.

## Consequences

- Light-mode contrast is the only theme contrast target, reducing visual variance and
  removing a class of broken theme states.
- Native iOS system surfaces may adapt their material behavior, but WhiteRabbit-owned
  surfaces continue to request and render a light appearance.
- The first product milestone is a buildable web/mobile shell and shared executable
  foundation. A visible placeholder must say when a capability is not connected; it
  must never simulate operational camera, inference, or backend success.
- A future theme expansion requires a superseding ADR and full visual/accessibility
  regression evidence.

## Rollback

Revert the relevant package manifest and lockfile commit, restore the last green CI
state, and record why the pin was unsuitable. Reverting a package never relaxes the
light-only or synthetic-data boundary.
