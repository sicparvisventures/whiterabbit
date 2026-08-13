# WhiteRabbit

WhiteRabbit is an open-source, edge-first ALPR and visual-event platform for legally authorized Belgian public-sector deployments.

The product direction is simple: turn an old phone, laptop, webcam, or compatible IP camera into a local detector. Raw video stays on the node. Minimal signed candidate events go through policy checks and human review. Confirmed government-vehicle events can then appear as an auditable location history on a public map.

> **Project status:** foundation only. The durable-memory tooling is implemented and tested; the camera, ALPR, Supabase, Vercel, review, and map applications are not yet operational.

## Why WhiteRabbit

The system is designed around a hard distinction:

- **Public projection:** confirmed government-vehicle events with provenance, corroboration, human review, audit, and retraction.
- **Restricted processing:** minimized candidate evidence required for an authorized purpose and approved retention period.
- **Never public:** civilian plate histories, raw video, exact private camera locations, node credentials, or persistent person identities.

One OCR result or classifier score can never publish a plate. Open source code also does not grant anyone authority to deploy surveillance; every real deployment needs an accountable controller, legal basis, camera-law procedure, DPIA, and security review.

## Intended Architecture

```text
phone / laptop / camera gateway
        │ local detection + OCR
        │ signed minimal event, never a video stream
        ▼
Supabase restricted ingest and review state
        │ corroboration + human confirmation
        ▼
separate public projection
        │
        ▼
Vercel-hosted map and transparency UI
```

- Web control plane: Next.js and TypeScript on Vercel.
- Backend: Supabase Auth, PostgreSQL, RLS, Storage, Realtime, and narrowly scoped functions.
- Browser node: `getUserMedia` plus local ONNX/WASM inference.
- Desktop node: Python support for USB, RTSP, ONVIF, and MJPEG cameras.
- Contracts: versioned signed events with explicit candidate, review, public, retracted, and expired states.

## Durable Project Memory

WhiteRabbit includes repository-native project memory so new AI or human sessions can resume from reviewed state instead of hidden chat history.

```bash
python3 -m unittest discover -s tests -v
python3 scripts/memory/memory_tool.py validate
python3 scripts/memory/memory_tool.py bootstrap
python3 scripts/memory/memory_tool.py checkpoint --summary "Document the completed outcome"
python3 scripts/memory/memory_tool.py validate --strict
```

Codex lifecycle hooks load bounded context at session start and request one repair turn when material repository content no longer matches `HEARTBEAT.md`. Review and trust the project hooks with `/hooks` before relying on them.

Start with [PROJECT_SPEC.md](PROJECT_SPEC.md), [BOOTSTRAP.md](BOOTSTRAP.md), and [memory/INDEX.md](memory/INDEX.md).

## Upstream and Licence

WhiteRabbit is inspired by and may lawfully reuse or adapt code from [SparrowMap](https://github.com/SparrowMap/sparrowmap). See [NOTICE.md](NOTICE.md) for attribution.

The project is licensed under the GNU Affero General Public License, version 3. If a modified version is offered over a network, users must be given the corresponding source as required by the licence.

## Safety and Responsible Use

- Do not deploy against public space without the required authority and procedures.
- Do not submit real footage, plates, credentials, or exact camera locations to this repository.
- Do not use WhiteRabbit for covert surveillance, civilian tracking, facial recognition, or public person search.
- Report security issues through GitHub private vulnerability reporting. See [SECURITY.md](SECURITY.md).
