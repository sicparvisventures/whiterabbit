# Current State

## Checkpoint

Date: 2026-08-13

The WhiteRabbit root repository exists locally on branch `main` with repository-local author `sicparvisventures <238694570+sicparvisventures@users.noreply.github.com>`.

The SparrowMap upstream is available as an ignored, clean research checkout in `sparrowmap/` at commit `dc78ec9e96d01e074c98338a8bf3de8d28f33578`, tag `v0.1.0`. It is not vendored into WhiteRabbit.

## Approved Direction

- Public, English-language, AGPL-3.0-compatible project named WhiteRabbit.
- Belgian public-sector ALPR is the initial product direction.
- Government-vehicle detections may become public only after corroboration and human review.
- SparrowMap code may be reused lawfully with attribution.
- Person and object data are potential OSINT inputs, but identifying or persistent person tracking is not approved for implementation.
- Supabase is the intended backend and Vercel the intended web host; neither has been provisioned.
- Frequent atomic pushes are approved after validation.

## Implemented

- Repository-native memory validator and bounded bootstrap tool.
- Content fingerprinting that detects stale heartbeat state.
- Secret scanning for managed memory files.
- Codex `SessionStart`, `Stop`, and `SessionEnd` hooks.
- Stop-hook loop prevention.
- Nine unit/integration tests covering the memory tool and hooks.

## Verification Evidence

```text
python3 -m unittest discover -s tests -v
Ran 9 tests
OK
```

## Not Yet Implemented

- GitHub remote, initial commit, CI run, and release.
- Web application, Supabase project, schema, RLS, or Vercel project.
- Camera enrollment, browser inference, desktop node, ALPR pipeline, review queue, or public map.
- Production legal assessment, DPIA, controller agreement, retention schedule, or deployment authorization.

## Next Action

Complete foundation decisions and risk documentation, add CI and public-repository documentation, run strict validation, publish the initial atomic checkpoint, and create release `v0.1.0-foundation`.
