# WhiteRabbit

WhiteRabbit is an open-source, edge-first ALPR and visual-event platform for legally authorized Belgian public-sector deployments.

The product direction is simple: turn an old phone, laptop, webcam, or compatible IP camera into a local detector. Raw video stays on the node. Minimal signed candidate events go through policy checks and human review. A separate public projection exists only where the accountable controller explicitly permits it.

Belgian Defence is the first intended deployment. Municipalities and police are also target controllers, each with a strictly separate legal, data, oversight, hosting, and publication profile. ALPR and object detection remain the core; an optional biometric watchlist capability is now specified as a separate, fail-closed module.

> **Project status:** planning package and interactive synthetic prototype complete;
> owner review is next. Product runtime is not started. The camera, ALPR, biometric,
> Supabase, Vercel, review, and map applications are not yet operational.

## Why WhiteRabbit

The system is designed around a hard distinction:

- **Public projection:** profile-authorized government-vehicle events with provenance, corroboration, human review, audit, and retraction. Military, police, investigative, and protected movements are restricted by default.
- **Restricted processing:** minimized candidate evidence required for an authorized purpose and approved retention period.
- **Never public:** civilian plate histories, raw video, exact private camera locations, node credentials, or persistent person identities.
- **Biometric isolation:** no global watchlist, no cross-tenant person search, and no biometric route to the public projection.

One OCR result or classifier score can never publish a plate. Open source code also does not grant anyone authority to deploy surveillance; every real deployment needs an accountable controller, exact purpose, applicable camera procedure, DPIA decision, classification, hosting approval, retention, and security review.

## Intended Architecture

```text
phone / laptop / camera gateway
        │ local detection + OCR
        │ signed minimal event, never a video stream
        ▼
approved restricted ingest and review provider
        │ corroboration + human confirmation
        ▼
separate public projection
        │
        ▼
separately hosted map and transparency UI
```

- Web control plane: Next.js and TypeScript; Vercel where the profile permits it.
- Backend: PostgreSQL-compatible provider boundary; Supabase is a candidate for approved non-sensitive deployments.
- Restricted deployments: accredited or self-hosted adapters where public cloud is not approved.
- Mobile node: Expo/React Native development build with a visible foreground
  `Sentry Mode`, native camera integration, and a benchmarked inference adapter.
- Desktop node: Python support for USB, RTSP, ONVIF, and MJPEG cameras.
- Contracts: versioned signed events with explicit candidate, review, public, retracted, and expired states.

The proposed biometric edge pipeline detects and tracks a face, applies a quality
gate, creates a versioned embedding locally, compares it only with a scoped watchlist,
and sends a candidate alert to human review. The native iPhone node is foreground-
only; iOS releases the camera when the app backgrounds, and WhiteRabbit does not claim
locked-screen or hidden capture.

## Planning Package

- [Synthetic Defence pilot](docs/specs/0003-synthetic-defence-pilot.md)
- [Mobile edge and government control-plane architecture](docs/architecture/0001-system-architecture.md)
- [Native mobile and premium desktop product experience](docs/design/0001-product-experience.md)
- [Signed event and application API contract](docs/specs/0004-signed-event-and-api-contract.md)
- [Repository-grounded threat model](docs/security/whiterabbit-threat-model.md)
- [Compliance and institutional review gates](docs/compliance/0001-review-gates.md)
- [Phased synthetic implementation plan](docs/plans/0001-synthetic-defence-implementation.md)
- [Interactive mobile and desktop prototype](docs/design/0002-interactive-prototype.md)

## Review the Interactive Prototype

The dependency-free prototype contains generated data and no camera, inference,
authentication, network, persistence, or cloud behavior.

```bash
python3 -m http.server 4173 --directory prototypes/interactive
```

Open <http://localhost:4173> and follow the [mobile and desktop walkthrough](prototypes/interactive/README.md).

The next decision is owner approval of this product direction followed by separate
implementation and dependency batch D1 authorization. No cloud resource, production
dependency, model weight, dataset, or real data has been approved or added.

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

Start with [PROJECT_SPEC.md](PROJECT_SPEC.md), [the Belgian controller profiles](docs/specs/0001-belgian-controller-profiles.md), [the biometric watchlist specification](docs/specs/0002-biometric-watchlists.md), [BOOTSTRAP.md](BOOTSTRAP.md), and [memory/INDEX.md](memory/INDEX.md).

## Upstream and Licence

WhiteRabbit is inspired by and may lawfully reuse or adapt code from [SparrowMap](https://github.com/SparrowMap/sparrowmap). See [NOTICE.md](NOTICE.md) for attribution.

The project is licensed under the GNU Affero General Public License, version 3. If a modified version is offered over a network, users must be given the corresponding source as required by the licence.

## Safety and Responsible Use

- Do not deploy against public space without the required authority and procedures.
- Do not submit real footage, plates, credentials, or exact camera locations to this repository.
- Do not use WhiteRabbit for covert surveillance, untargeted civilian tracking, unauthorized facial recognition, or public person search.
- Report security issues through GitHub private vulnerability reporting. See [SECURITY.md](SECURITY.md).
