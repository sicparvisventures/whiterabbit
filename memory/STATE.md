# Current State

## Checkpoint

Date: 2026-08-13

The WhiteRabbit repository is public at https://github.com/sicparvisventures/whiterabbit on branch `main` with repository-local author `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.

The SparrowMap upstream is available as an ignored, clean research checkout in `sparrowmap/` at commit `dc78ec9e96d01e074c98338a8bf3de8d28f33578`, tag `v0.1.0`. It is not vendored into WhiteRabbit.

## Approved Direction

- Public, English-language, AGPL-3.0-compatible project named WhiteRabbit.
- Belgian public-sector ALPR is the initial product direction.
- Belgian Defence is the first intended deployment; municipalities and police must be supported as separate controller profiles.
- Government-vehicle detections may become public only when the controller profile permits it, after corroboration and human review. Military, police, investigative, and other sensitive movements are restricted by default.
- SparrowMap code may be reused lawfully with attribution.
- Person and object data are potential OSINT inputs, but identifying or persistent person tracking is not approved for implementation.
- Supabase and Vercel are candidates for approved non-sensitive profiles. Restricted, operational, intelligence, or classified profiles require an accredited or self-hosted topology; nothing has been provisioned.
- Frequent atomic pushes are approved after validation.

## Implemented

- Repository-native memory validator and bounded bootstrap tool.
- Content fingerprinting that detects stale heartbeat state.
- Secret scanning for managed memory files.
- Codex `SessionStart`, `Stop`, and `SessionEnd` hooks.
- Stop-hook loop prevention.
- Nine unit/integration tests covering the memory tool and hooks.
- Public GitHub repository and protected source history.
- GitHub Actions CI for tests and strict memory validation.
- Tagged foundation release `v0.1.0-foundation`.
- Draft Belgian controller-profile specification and proposed ADR-0004 covering Defence administration, armed-forces operations, intelligence, police, and municipalities.

## Verification Evidence

```text
python3 -m unittest discover -s tests -v
Ran 9 tests
OK

GitHub Actions run 31695235263
Conclusion: success

GitHub Actions CI run 31695302196
Conclusion: success

GitHub release
https://github.com/sicparvisventures/whiterabbit/releases/tag/v0.1.0-foundation
```

## Not Yet Implemented

- Web application, Supabase project, schema, RLS, or Vercel project.
- Camera enrollment, browser inference, desktop node, ALPR pipeline, review queue, or public map.
- Production legal assessment, DPIA, controller agreement, retention schedule, or deployment authorization.

## Next Action

Obtain owner feedback on Spec 0001, select the exact `BE-DEFENCE-ADMIN` pilot purpose, and then submit the profile, DPIA, hosting, retention, and publication boundaries to the accountable Defence, DPO, legal, security, and operational reviewers before implementing real surveillance data flows.
