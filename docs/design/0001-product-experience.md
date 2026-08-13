# Product Experience 0001: Native Field App and Operational Command Center

- Status: approved for light-only synthetic implementation
- Date: 2026-08-13
- Product language: English
- Accessibility target: WCAG 2.2 AA on web and equivalent native platform support

## Experience Principle

WhiteRabbit should feel calm when the system is healthy and unmistakably explicit
when it is not. It is a high-consequence operational tool, not a cinematic surveillance
demo. Every important screen answers four questions quickly:

1. What is the system observing or asking me to review?
2. How fresh, complete, and trustworthy is that information?
3. Under which deployment, purpose, policy, model, and authority does it exist?
4. What action can I take, and what will that action actually do?

The mobile app is a focused field instrument. The desktop app is an information-dense
analysis and governance workspace. They share vocabulary and semantic tokens but do
not force identical layouts.

## Visual Language

### Character

- Precise, restrained, information-first, and premium.
- Neutral surfaces with blue for primary action, amber for degraded/attention, red
  for destructive or stopped states, and green only for verified healthy state.
- No neon “AI” gradients, fake radar sweeps, ornamental grids, glowing borders,
  emoji icons, or decorative live video walls.
- Confidence and urgency are never expressed by color alone.

### Typography

- iOS uses the system text styles so Dynamic Type, weight, and optical sizing behave
  natively. Do not ship or imitate SF Pro as a custom font.
- Web uses Inter with a metric-compatible system fallback; tabular figures are used
  for timestamps, sequences, confidence bands, durations, and counts.
- Base content is at least 16 px/points. Metadata may use 13–14 only when it remains
  legible at the supported accessibility settings.

### Semantic color tokens

| Token | Light intent |
| --- | --- |
| `surface.canvas` | cool near-white |
| `surface.panel` | opaque white |
| `text.primary` | near-black navy |
| `text.secondary` | accessible slate |
| `action.primary` | Belgian-neutral operational blue |
| `status.healthy` | verified green |
| `status.attention` | amber |
| `status.critical` | deep red |
| `focus.ring` | high-contrast blue/black |

WhiteRabbit ships one light product theme. There is no dark/system theme selector.
Exact values are shared design tokens and contrast-tested before code lands;
components do not contain ad-hoc hex values. Dark camera, image, or map content may
remain inside a clearly bounded viewport while the surrounding product chrome stays
light.

### Materials and depth

On iOS 26, native system headers, tab bars, sheets, menus, and transient controls may
receive Liquid Glass from the platform. Glass is a functional control/navigation
layer only. Event cards, candidate evidence, maps, tables, and forms use opaque or
standard-material surfaces to preserve contrast and evidentiary clarity. Reduced
transparency and increased contrast settings must remain fully usable.

The desktop uses a shallow elevation scale, subtle separators, and clear pane
boundaries. It takes inspiration from premium operational-intelligence workflows—
dense multi-pane context, provenance, map/table/timeline coordination—without copying
Palantir branding, trade dress, or proprietary interaction details.

## Mobile Information Architecture

The primary tab bar has four labeled destinations:

1. **Sentry** — node readiness, camera, start/stop, live health, and local queue.
2. **Alerts** — assigned restricted candidates and review state.
3. **Nodes** — enrolled devices visible to the current role and their health.
4. **More** — deployment context, security, accessibility, diagnostics, legal notices,
   open-source notices, and sign out.

Watchlist enrollment, policy editing, bulk exports, tenant administration, and complex
analytics are desktop-first. A mobile deep link may open a read-only summary or a
single scoped approval when the role and `aal2` policy permit it.

## Mobile Core Flows

### Sign-in and step-up

- Email and password with system autofill, password manager support, visible labels,
  recovery, and clear environment/deployment context.
- TOTP enrollment and challenge use a resumable, explicit flow. Privileged deep links
  route through step-up and return to their original destination.
- Errors state cause and recovery without revealing whether an unrelated account
  exists.

### Node enrollment

- Scan a short-lived QR claim or open an approved universal/deep link.
- Show the deployment, fictional site, capabilities, claim expiry, and enrolling
  administrator before confirmation.
- Run camera, secure-key, storage, power, network, and policy checks independently.
- Finish with a signed enrollment receipt and a visible recovery/revoke path.

### Sentry Mode

The camera content is primary and edge-to-edge where safe. A compact native control
layer shows:

- prominent `Start Sentry` or hold-to-confirm `Stop Sentry` action;
- `READY`, `DEGRADED`, `STOPPED`, or `REVOKED` state plus plain-language reason;
- current deployment/space, capture mask, active capabilities, policy/watchlist age,
  queue count, power, thermal, network, and last accepted heartbeat;
- no bounding-box confetti by default. A diagnostic overlay is opt-in and synthetic
  or locally authorized.

Starting requires an explicit tap after readiness. Remote services cannot start it.
Backgrounding, camera loss, revoked policy, or unsafe thermal state visibly stops the
session. The UI never implies continued capture after iOS releases the camera.

### Candidate review

- The title always says `Candidate`, never `Match` or `Identified`.
- Show evidence only after authorization and only for its remaining TTL.
- Present source node, observation window, policy/model/package versions, quality
  gates, corroboration count, calibrated score band, and known limitations.
- Primary outcomes are `Confirm candidate`, `Reject`, and `Inconclusive`; confirmation
  text explains that it is a review outcome, not an adverse-action authorization.
- Destructive or consequential actions are separated, require confirmation, and
  create a visible audit receipt.

## Desktop Information Architecture

The desktop shell uses a persistent left navigation rail, a slim global context bar,
a resizable central workspace, and an optional right inspector. It supports keyboard
navigation and a command palette without hiding core actions behind shortcuts.

Primary destinations:

- **Overview** — readiness, current risk, queue age, node health, retention, and
  policy/package expiry.
- **Operations** — synchronized map, event table, and timeline with saved views.
- **Candidates** — capability-specific review queues and workload state.
- **Watchlists** — governed sources, maker-checker status, package scope, expiry,
  revocation, model compatibility, and audit.
- **Nodes** — enrollment, desired state, health, supported-device policy, packages,
  keys, and last attestation.
- **Policies** — read-only effective policy plus scoped administrative proposals.
- **Audit** — append-evident access, mutation, decision, deletion, and export records.

### Operational workspace

- Map, table, timeline, and inspector share one typed selection model.
- A filter chip always shows deployment and classification; it cannot be dismissed.
- Staleness is visible per pane and per selected record.
- Tables support sorting, column visibility, saved views, keyboard row navigation,
  pagination/virtualization, and an accessible record detail alternative.
- Maps cluster and aggregate at overview levels. Exact node coordinates are shown only
  to explicitly permitted roles and never appear in public projections.
- The inspector keeps provenance and policy beside the observation so analysts do not
  need to navigate away to judge trust.

### Density modes

- `Comfortable` is the default and preserves 44 px interactive targets.
- `Compact` reduces visual padding for trained desktop users but never shrinks focus,
  click, or keyboard target geometry below accessibility requirements.
- Mobile has no compact mode.

## Motion and Feedback

- Use 150–300 ms native-feeling, interruptible motion only to explain hierarchy,
  state transition, pane selection, or successful completion.
- Sentry state changes and destructive results do not rely on animation; text, icon,
  and persistent state update immediately.
- Respect reduced motion. Avoid parallax, auto-playing video, decorative pulsing,
  cascading alert animations, and width/height animation.
- Operations over 300 ms show bounded progress; longer data loads use skeletons with
  reserved geometry. A loading control is disabled against duplicate submission.

## Accessibility and Ergonomics

- Minimum 44 by 44 point mobile targets and 8-point separation.
- Full VoiceOver/screen-reader labels, hints, logical order, and status announcements.
- Dynamic Type through the largest supported accessibility sizes without hiding stop,
  back, review, or recovery actions.
- Visible keyboard focus, skip links, semantic landmarks, sortable-table semantics,
  focus restoration, and no hover-only interaction on web.
- Color is always paired with text and icon/shape. Normal text contrast is at least
  4.5:1 and non-text controls at least 3:1.
- Dates, times, numbers, and time zones are locale-aware; operational records display
  an unambiguous absolute time with a relative-age aid.
- Small phone, large phone, tablet, desktop, portrait, and landscape are designed and
  tested. Safe areas and the home indicator never cover controls or scroll content.

## Performance Budgets

- Camera and inference work do not run on the React render loop.
- Tap feedback appears within 100 ms; the UI targets 60 fps during camera preview and
  list scrolling, with measured degraded behavior on the minimum supported device.
- Mobile lists virtualize after 50 items and evidence loads on demand.
- Desktop route and pane data load progressively; heavy maps, charts, and inspectors
  are split from the initial shell.
- Live updates are coalesced. A flood of events changes counts and queues without
  forcing the entire workspace to rerender.

## Design Acceptance Checklist

- [ ] Sentry start and stop cannot be confused, hidden, or remotely triggered.
- [ ] `Candidate` terminology appears consistently; no score is presented as identity.
- [ ] Every privileged action shows deployment, purpose, consequence, and audit result.
- [ ] Light appearance, reduced transparency, increased contrast, reduced motion,
      and largest Dynamic Type modes are tested.
- [ ] Mobile targets are at least 44 points and safe-area correct on the oldest
      supported iPhone plus a current small and large device.
- [ ] Desktop works at 1024, 1280, 1440, and wide-screen widths without horizontal
      page overflow; purposeful tables may scroll inside a labeled region.
- [ ] Keyboard-only and screen-reader review flows reach the same outcome as pointer
      or touch flows.
- [ ] Empty, loading, offline, stale, degraded, revoked, expired, forbidden, and error
      states have actionable copy and do not resemble healthy current data.
- [ ] No proprietary third-party product is copied or presented as affiliated.

## Design References

- Apple materials and Liquid Glass: https://developer.apple.com/design/human-interface-guidelines/materials
- Expo Router native tabs: https://docs.expo.dev/router/advanced/native-tabs/
- Expo Router native stack/iOS 26 headers: https://docs.expo.dev/router/advanced/stack/

These are interaction references, not permission to copy protected assets or trade
dress. WhiteRabbit will use its own name, iconography, tokens, and component system.
