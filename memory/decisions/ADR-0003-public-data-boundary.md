# ADR-0003: Corroborated Government-Vehicle Public Tier

- Status: accepted with deployment legal gate
- Date: 2026-08-13

## Context

WhiteRabbit's core objective is an easy-to-read public location history for government vehicles detected by ordinary camera-capable devices. Incorrectly publishing a civilian plate or a sensitive government movement can cause serious harm.

## Decision

Only a confirmed government-vehicle event is eligible for the public projection. Eligibility requires independent corroboration, provenance, and human review. OCR or one classifier alone can never publish. Civilian plate text is not persisted centrally or made searchable. Raw video remains on the node.

Person and object analysis defaults to non-identifying event categories and counts. Facial recognition, persistent person re-identification, and public person search are excluded until a separate approved specification and authorization exist.

## Consequences

- Candidate, private, reviewed, confirmed-public, retracted, and expired states must be explicit in the event contract.
- The public database or view must be technically separated from restricted evidence.
- Retraction, audit, sensitive-category suppression, and policy transparency are launch requirements.
- Each deployment needs its own legal basis, DPIA, retention, review, and publication policy.
