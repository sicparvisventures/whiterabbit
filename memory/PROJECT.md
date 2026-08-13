# Project Memory

## Identity

- Name and repository codename: WhiteRabbit
- Owner and GitHub account: `sicparvisventures`
- Language: English product and code; Belgium is the first compliance and deployment profile.
- Licence: AGPL-3.0-compatible public source.
- Upstream reference: SparrowMap, used lawfully with attribution where code is reused or adapted.

## Vision

Build an open-source ALPR and visual-event network for authorized Belgian public-sector use. Any phone, laptop, webcam, or compatible IP camera should be able to become a privacy-preserving edge node. Local inference turns video into minimal signed events; a controller-specific policy determines whether an event remains restricted or can become an auditable public record.

Belgian Defence is the first intended deployment. Municipalities and police are equal product targets with separate controller, purpose, oversight, retention, hosting, and publication boundaries.

The product must work for one operator and one node before federation or community scale is required.

## Core Domain

- **Deployment:** one legally accountable controller, one immutable controller profile, and its policy boundary.
- **Space:** an operational area inside a deployment.
- **Node:** a camera device or gateway performing local inference.
- **Event:** a signed, minimal observation created by a node.
- **Review:** human confirmation or rejection of a candidate public record.
- **Circle:** an invite-only collaboration boundary.
- **Bridge:** an explicit, revocable, scoped sharing agreement between circles or deployments; it never silently merges history or ownership.
- **Policy profile:** a versioned, fail-closed rule set for one Belgian controller regime and data classification.
- **Public record:** a confirmed event separately authorized for publication by the deployment profile; government ownership alone never makes a movement public.

## Product Principles

1. Edge inference first; raw video stays local.
2. Public claims require corroboration, provenance, and human review.
3. Civilian data is minimized, redacted, short-lived, and never publicly searchable.
4. A camera owner and deployment controller remain accountable and auditable.
5. Sharing is explicit, scoped, revocable, and prospective by default.
6. The open repository never contains operational data.
7. Authorities share a technical core, not a pooled database or assumed common mandate.

## First Product Slice

An authorized operator can enroll an old phone or laptop, aim it at an approved area, detect vehicles locally, submit signed candidate events, and review them inside one controller deployment without exposing civilian plate histories or raw video. A separately authorized public projection is optional and profile-specific.

## Research Scope

Non-identifying person and object events may support crowd counts, hazards, abandoned objects, traffic conditions, public assets, and incident context. Persistent person identification, face recognition, or cross-camera person tracking are excluded until separately specified and authorized with a legal basis, DPIA, security review, and abuse analysis.

## Non-Goals

- No general public person-search service.
- No public civilian plate history.
- No covert camera deployment tooling.
- No central raw-video lake.
- No unaudited automated publication.
- No silent data pooling between Defence, police, municipalities, or intelligence contexts.
- No default publication of military, police, investigative, or protected movement history.
- No assumption that open-source software itself grants surveillance authority.
