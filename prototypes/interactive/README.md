# WhiteRabbit Interactive Prototype

This dependency-free prototype is the review surface for the WhiteRabbit mobile field
app and desktop command center. All people, nodes, events, sites, credentials, images,
times, watchlists, and audit records are generated and synthetic.

It does not request a camera, run inference, authenticate a user, call an API, persist
data, or contact Supabase, Vercel, or any other service.

The prototype and product use one light appearance. There is no dark/system theme
selector; only bounded camera, evidence, or map viewports may use dark source imagery.

## Run locally

From the repository root:

```bash
python3 -m http.server 4173 --directory prototypes/interactive
```

Open <http://localhost:4173>. The top switcher moves between the mobile and desktop
surfaces. Direct routes are bookmarkable.

## Recommended mobile walkthrough

1. Start at `#mobile/signin` and continue through the generated password and TOTP.
2. Review the short-lived node claim and complete the six readiness checks.
3. Start Sentry Mode, show the diagnostic overlay, and inspect node health.
4. Open Alerts, select `BIO-0281`, expand provenance, and record a review outcome.
5. Inspect the append-only audit receipt and return to the candidate queue.
6. Review Nodes and More for remote-control and prototype limitations.

The side flow rail appears on a desktop review viewport. On a phone-sized viewport,
the prototype presents the app alone.

## Recommended desktop walkthrough

1. Open `#desktop/overview` for readiness, candidate pressure, fleet health, and trends.
2. Open Operations and select each event to synchronize the event rail, fictional map,
   timeline, and provenance inspector.
3. Open Candidates, switch density, select a row, and record a guarded human outcome.
4. Review Watchlists for tenant scope, authority, maker-checker, expiry, and revocation.
5. Select a Node and verify that remote controls can stop but never start its camera.
6. Review the effective Policy and its role-capability matrix.
7. Verify the Audit chain and prepare a synthetic restricted export.
8. Press `Command-K` on macOS or `Control-K` elsewhere to open the command palette.

## Review sizes

- Mobile: 320 × 780 and 390 × 844.
- Desktop: 1024 × 768, 1280 × 900, and 1440 × 1000.
- Wide screens: content is bounded while the operations workspace expands.

Purposeful data regions may scroll. The desktop page itself has no horizontal overflow
at the supported desktop widths.

## Approval boundary

The owner approved the interaction direction, light-only revision, synthetic product
implementation and dependency batch D1 on 2026-08-13. This does not authorize camera
access, model artifacts, biometric processing, cloud provisioning, or real data.
