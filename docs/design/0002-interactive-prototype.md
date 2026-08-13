# Product Experience 0002: Interactive Prototype

- Status: owner-approved with required light-only revision
- Date: 2026-08-13
- Surface: dependency-free HTML, CSS, and JavaScript
- Data: generated and synthetic only
- Supersedes: none
- Implements the review intent of: Product Experience 0001

## Owner decision

On 2026-08-13 the owner approved the combined mobile and desktop information
architecture, authorized product implementation and dependency batch D1, and required
one light appearance only. The theme selector was removed and the desktop prototype
was revised to a light shell; bounded camera, evidence, or map imagery may remain dark.

This prototype tests information architecture, language, hierarchy, density, and
guarded decision flows. It is not a thin implementation of the eventual Expo or
Next.js applications and contains no operational surveillance capability.

## Shared experience contract

Both surfaces keep four facts continuously visible:

1. deployment `SYNTH-01`;
2. controller profile `BE-DEFENCE-ADMIN`;
3. classification `RESTRICTED · SYNTHETIC`;
4. the distinction between a machine-generated candidate and a human outcome.

Blue means navigation or primary action, green means verified healthy state, amber
means attention, and red means critical or destructive state. Color is paired with
text, shape, and an icon. Exact biometric scores are deliberately absent from the
decision surface.

## Mobile field instrument

The mobile flow is linear where mistakes are costly and tabbed where routine field
work benefits from direct access.

| Stage | Operator decision | Persistent safeguard |
| --- | --- | --- |
| Sign in and MFA | Request an AAL2 field session | Generated credentials; no real auth |
| Enrollment | Accept a short-lived deployment claim | User and node identities remain separate |
| Readiness | Confirm device, policy, power, network, and capture zone | Explicit mount/capture-zone acknowledgement |
| Sentry | Start or stop foreground observation | Raw frames stay local; remote start is prohibited |
| Alerts | Triage ALPR, object, and biometric candidates | `Candidate` language across modalities |
| Review | Confirm, reject, or mark inconclusive | Warning says no identity determination or authority to act |
| Receipt | Verify the recorded outcome | Append-only sequence, policy, reviewer, and AAL2 context |

The main call to action remains reachable at 320 px. Mobile uses light, system-like
surfaces around a dark camera preview so field status is immediately legible without
turning the whole product into a generic dark dashboard.

## Desktop command center

The desktop experience uses a restrained light operational canvas, persistent left
navigation, fixed deployment context, a slim global bar, and optional inspectors.

| Destination | Primary question |
| --- | --- |
| Overview | Is the deployment ready, current, and within review/retention targets? |
| Operations | What happened, where in the fictional site, when, and with what provenance? |
| Candidates | Which correlated observations need an accountable human outcome? |
| Watchlists | Which scoped package is authorized, signed, approved, compatible, and current? |
| Nodes | Which devices are healthy, attested, packaged, and locally controllable? |
| Policies | Which immutable revision governs each capability and role? |
| Audit | Can every access, decision, event, and export be verified in sequence? |

The operations workspace synchronizes event rail, fictional map, timeline, and
inspector through a shared selection. Exact coordinates remain labelled restricted.
The desktop review produces the same guarded outcome as mobile without changing into
the mobile route.

## Interaction inventory

- Hash routes make every mobile and desktop screen directly reviewable.
- Mobile sign-in, MFA, enrollment, readiness, sentry start/stop, overlay, candidate,
  review dialog, receipt, nodes, and settings are clickable.
- Desktop navigation, event selection, node selection, candidate review, density,
  watchlist selection, governed actions, policy actions, audit actions, and command
  navigation are clickable.
- `Escape` closes modal layers. `Command-K`/`Control-K` opens desktop navigation.
- Actions that would mutate real systems return explicit synthetic prototype feedback.

## Responsive and accessibility evidence

- Browser walkthrough: mobile 320 × 780 and 390 × 844.
- Browser walkthrough: desktop 1024 × 768, 1280 × 900, and 1440 × 1000.
- No page-level horizontal overflow at the supported desktop sizes.
- Desktop comfortable controls have a 44 px minimum target; compact rows retain at
  least 44 px target geometry.
- The prototype has landmarks, direct labels, a skip link, visible focus, live status
  announcements, reduced-motion handling, increased-contrast handling, and semantic
  modal dialogs.
- Browser console: zero errors and zero warnings during the verified walkthroughs.

This is not a completed WCAG conformance audit. Production Expo and Next.js surfaces
must implement native Dynamic Type, focus restoration/trapping, table semantics,
screen-reader hints, localization, and automated accessibility tests.

## Explicit non-capabilities

The prototype has no camera permission, media stream, OCR, object detector, face
detector, embedding model, watchlist database, signature, credential, API, local
storage, telemetry, map provider, Supabase project, or Vercel deployment. No visual
element should be interpreted as proof that those controls are implemented.

## Owner review outcome

- [x] Mobile feels like a focused native field instrument.
- [x] Desktop feels premium and operational without copying a third-party product.
- [x] ALPR and object detection remain first-class beside the gated biometric module.
- [x] Candidate, provenance, authority, classification, retention, and audit language
      are sufficiently clear.
- [x] The mobile flow includes the right decisions in the right order.
- [x] The desktop destinations and density match analyst and administrator needs.
- [x] The owner authorizes synthetic implementation and dependency batch D1.
- [x] Product implementation uses one light appearance; the dark/system variants are
      not approved.
