# Bootstrap

WhiteRabbit uses bounded, repository-native memory so a new session can resume without depending on previous chat history.

## Start Here

1. Read `HEARTBEAT.md` for the current checkpoint and next action.
2. Read `memory/INDEX.md` and open only the context relevant to the task.
3. Run `python3 scripts/memory/memory_tool.py validate`.
4. Inspect `git status --short --branch` before changing files.
5. Confirm the active task has acceptance criteria and a verification command.

## Before Handoff

1. Update durable memory with outcomes and evidence.
2. Run tests relevant to the changed behavior.
3. Refresh the heartbeat fingerprint.
4. Run strict memory validation.
5. Commit and push a coherent checkpoint when publishing is in scope.

The lifecycle hooks automate loading and freshness checks. They do not write chat transcripts, invent project decisions, or blindly push the worktree.
