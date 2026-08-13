(function () {
  "use strict";

  const WR = () => window.WhiteRabbit;
  const statusIcon = (state) => state === "healthy" ? "check" : state === "attention" ? "alert" : "info";

  function phoneFrame(content, options = {}) {
    return `
      <div class="mobile-workbench">
        <aside class="flow-rail" aria-label="Mobile prototype flow">
          <span class="eyebrow">Mobile flow</span>
          <h1>Field node</h1>
          <p>Walk from secure sign-in to active capture, candidate review, and an audit receipt.</p>
          ${flowLink("signin", "01", "Sign in")}
          ${flowLink("mfa", "02", "Step-up")}
          ${flowLink("enroll", "03", "Enroll node")}
          ${flowLink("readiness", "04", "Readiness")}
          ${flowLink("sentry", "05", "Sentry")}
          ${flowLink("alerts", "06", "Alerts")}
          ${flowLink("candidate", "07", "Candidate")}
          ${flowLink("receipt", "08", "Audit receipt")}
          <div class="flow-note"><strong>Prototype boundary</strong><span>No camera access. No inference. Every record is generated and synthetic.</span></div>
        </aside>
        <section class="phone-stage" aria-label="iPhone prototype">
          <div class="phone-device ${options.camera ? "has-camera" : ""}">
            <div class="phone-status"><span>09:41</span><span class="dynamic-island"></span><span class="phone-signals">● ◔ ▰</span></div>
            <div class="phone-screen">${content}</div>
            <span class="home-indicator" aria-hidden="true"></span>
          </div>
          <div class="phone-caption"><span>390 × 844 review viewport</span><span>English · iOS 26 direction</span></div>
        </section>
      </div>`;
  }

  function flowLink(screen, number, label) {
    const active = WR().state.mobileScreen === screen;
    return `<a href="#mobile/${screen}" data-route="mobile/${screen}" class="flow-step ${active ? "is-active" : ""}" ${active ? 'aria-current="page"' : ""}><span>${number}</span><strong>${label}</strong></a>`;
  }

  function brandHeader(action = "") {
    return `<header class="mobile-header"><div class="mobile-brand"><span class="brand-mark">${WR().icon("rabbit", 20)}</span><strong>WhiteRabbit</strong></div>${action}</header>`;
  }

  function contextStrip() {
    return `<div class="context-strip"><span class="context-dot"></span><span><strong>SYNTH-01</strong><small>BE-DEFENCE-ADMIN</small></span><span class="classification">RESTRICTED · SYNTHETIC</span></div>`;
  }

  function tabBar(active) {
    const tabs = [
      ["sentry", "sentry", "Sentry"],
      ["alerts", "alert", "Alerts", "3"],
      ["nodes", "nodes", "Nodes"],
      ["more", "more", "More"],
    ];
    return `<nav class="mobile-tabs" aria-label="Primary mobile navigation">${tabs.map(([screen, icon, label, badge]) => `<a href="#mobile/${screen}" data-route="mobile/${screen}" class="mobile-tab ${active === screen ? "is-active" : ""}" ${active === screen ? 'aria-current="page"' : ""}>${WR().icon(icon, 21)}<span>${label}</span>${badge ? `<em>${badge}</em>` : ""}</a>`).join("")}</nav>`;
  }

  function screenShell(content, active = "sentry", options = {}) {
    return `${brandHeader(options.action || "")}${options.noContext ? "" : contextStrip()}<main class="mobile-content ${options.flush ? "is-flush" : ""}">${content}</main>${options.noTabs ? "" : tabBar(active)}`;
  }

  function signin() {
    return phoneFrame(`
      <div class="auth-screen">
        <div class="auth-visual"><span class="auth-mark">${WR().icon("rabbit", 38)}</span><span class="synthetic-pill">SYNTHETIC ENVIRONMENT</span></div>
        <div class="auth-copy"><span class="eyebrow">Secure field access</span><h1>Welcome back</h1><p>Sign in to your authorized WhiteRabbit deployment.</p></div>
        <form class="auth-form" data-prototype-form>
          <label for="mock-email">Work email</label>
          <div class="input-wrap">${WR().icon("person", 18)}<input id="mock-email" type="email" autocomplete="username" value="operator@synthetic.example" /></div>
          <label for="mock-password">Password</label>
          <div class="input-wrap">${WR().icon("lock", 18)}<input id="mock-password" type="password" autocomplete="current-password" value="synthetic-only" /></div>
          <button type="button" class="primary-button is-full" data-action="mobile-signin">Continue securely ${WR().icon("chevron", 18)}</button>
          <button type="button" class="link-button">Forgot password?</button>
        </form>
        <div class="auth-security">${WR().icon("shield", 18)}<span><strong>Authorized access only</strong><small>Activity is logged. No real accounts in this prototype.</small></span></div>
      </div>`, { camera: false });
  }

  function mfa() {
    return phoneFrame(`
      <div class="auth-screen mfa-screen">
        <button class="back-button" data-route="mobile/signin" aria-label="Back to sign in">${WR().icon("back", 22)}</button>
        <div class="mfa-icon">${WR().icon("shield", 30)}</div>
        <div class="auth-copy"><span class="eyebrow">Step 2 of 2</span><h1>Verify it’s you</h1><p>Enter the 6-digit code from your authenticator app.</p></div>
        <form class="auth-form" data-prototype-form>
          <label for="mock-code">Authentication code</label>
          <input id="mock-code" class="code-input" inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="284193" aria-describedby="code-help" />
          <small id="code-help" class="field-help">Code refreshes every 30 seconds.</small>
          <button type="button" class="primary-button is-full" data-action="mobile-mfa">Verify and continue</button>
        </form>
        <div class="session-card"><span>${WR().icon("person", 20)}</span><div><strong>Field Operator</strong><small>Privileged session requested · AAL2</small></div></div>
      </div>`);
  }

  function enroll() {
    return phoneFrame(screenShell(`
      <section class="mobile-title"><span class="eyebrow">Node enrollment</span><h1>Review this claim</h1><p>A short-lived administrator claim was scanned on this iPhone.</p></section>
      <div class="enrollment-card">
        <div class="enrollment-map"><span class="map-grid"></span><span class="site-pin">${WR().icon("map", 22)}</span><small>Fictional perimeter</small></div>
        <div class="enrollment-body"><span class="status-pill is-attention">Expires in 08:42</span><h2>North Gate · SYNTH-01</h2><p>Administrative site-security workflow validation</p>
          <dl class="detail-list"><div><dt>Profile</dt><dd>BE-DEFENCE-ADMIN</dd></div><div><dt>Requested by</dt><dd>A. Vermeer · Admin</dd></div><div><dt>Capabilities</dt><dd>ALPR · Objects · Synthetic biometrics</dd></div><div><dt>Data nature</dt><dd>Synthetic only</dd></div></dl>
        </div>
      </div>
      <div class="notice-card">${WR().icon("info", 20)}<p>Enrollment creates a separate device identity. Your user session never becomes the node credential.</p></div>
      <button class="primary-button is-full" data-action="accept-enrollment">Accept and run checks</button>
      <button class="secondary-button is-full" data-route="mobile/signin">Decline claim</button>
    `, "sentry", { noTabs: true }));
  }

  function readiness() {
    const checks = [
      ["camera", "Camera access", "Rear camera · 1080p", "healthy"],
      ["key", "Device identity", "Protected P-256 key", "healthy"],
      ["database", "Local storage", "Encrypted · 1.8 GB free", "healthy"],
      ["bolt", "External power", "Connected · 96%", "healthy"],
      ["wifi", "Secure network", "Online · 38 ms", "healthy"],
      ["shield", "Policy package", "v1.4 · expires in 5d", "healthy"],
    ];
    return phoneFrame(screenShell(`
      <section class="mobile-title"><span class="eyebrow">Enrollment checks</span><div class="readiness-score"><strong>6/6</strong><span>ready</span></div><h1>Node is ready</h1><p>Complete mounting and capture-zone confirmation before starting.</p></section>
      <div class="check-list">${checks.map(([icon, name, detail, status]) => `<div class="check-row"><span class="check-icon">${WR().icon(icon, 19)}</span><span><strong>${name}</strong><small>${detail}</small></span><span class="check-result is-${status}">${WR().icon(statusIcon(status), 17)}</span></div>`).join("")}</div>
      <label class="confirm-row"><input type="checkbox" checked data-action="readiness-check"/><span><strong>Mount and capture mask verified</strong><small>The phone is stable, powered, visible, and aimed only at the fictional approved zone.</small></span></label>
      <button class="primary-button is-full" data-action="complete-readiness">Finish enrollment</button>
    `, "sentry", { noTabs: true }));
  }

  function sentry() {
    const running = WR().state.sentryRunning;
    return phoneFrame(screenShell(`
      <section class="camera-panel ${running ? "is-running" : ""}">
        <div class="camera-scene" aria-label="Synthetic camera preview illustration">
          <span class="scene-sky"></span><span class="scene-building"></span><span class="scene-road"></span><span class="scene-gate"></span><span class="scene-car"></span>
          <div class="camera-top"><span class="status-pill ${running ? "is-running" : "is-neutral"}"><i></i>${running ? "SENTRY ACTIVE" : "READY"}</span><button class="camera-control" data-action="toggle-overlay" aria-pressed="${WR().state.overlay}">${WR().icon("eye", 18)} Overlay</button></div>
          ${WR().state.overlay ? `<div class="detection-box vehicle-box"><span>VEHICLE · 0.94</span></div><div class="detection-box zone-box"><span>CAPTURE ZONE</span></div>` : ""}
          <div class="camera-crosshair"><span></span><span></span></div>
          <div class="camera-bottom"><span>${WR().icon("camera", 16)} Rear · 1080p</span><span>${running ? "12.4 fps sampled" : "Preview only"}</span></div>
        </div>
      </section>
      <section class="sentry-control-card">
        <div class="sentry-state"><span class="state-orb ${running ? "is-live" : ""}">${WR().icon("sentry", 25)}</span><div><span class="eyebrow">Node WR-IP-001</span><h1>${running ? "Observing locally" : "Ready to observe"}</h1><p>${running ? "Frames stay on this iPhone. Only signed candidates can leave." : "Starting requires an explicit tap and keeps this screen active."}</p></div></div>
        <button class="${running ? "stop-button" : "primary-button"} is-full" data-action="${running ? "open-dialog" : "start-sentry"}" ${running ? 'data-dialog="stop-sentry"' : ""}>${running ? `${WR().icon("close", 18)} Stop Sentry` : `${WR().icon("camera", 18)} Start Sentry`}</button>
      </section>
      <section class="health-grid" aria-label="Node health">
        ${healthCard("bolt", "Power", "External", "96%")}
        ${healthCard("temperature", "Thermal", "Nominal", "31°")}
        ${healthCard("wifi", "Network", "Online", "38 ms")}
        ${healthCard("database", "Outbox", "Encrypted", running ? "2 queued" : "Empty")}
      </section>
      <section class="mobile-section"><div class="section-heading"><div><span class="eyebrow">Authority</span><h2>Active packages</h2></div><button class="link-button">Details</button></div>
        <div class="package-row"><span class="package-icon">${WR().icon("shield", 20)}</span><div><strong>Policy v1.4</strong><small>Expires 18 Aug · 14:00</small></div><span class="status-pill is-healthy">Verified</span></div>
        <div class="package-row"><span class="package-icon">${WR().icon("person", 20)}</span><div><strong>Watchlist SYN-WL-04</strong><small>480 generated identities</small></div><span class="status-pill is-healthy">Scoped</span></div>
      </section>
    `, "sentry", { flush: true }), { camera: true });
  }

  function healthCard(icon, label, value, meta) {
    return `<div class="health-card"><span>${WR().icon(icon, 18)}</span><small>${label}</small><strong>${value}</strong><em>${meta}</em></div>`;
  }

  const candidates = [
    { id: "BIO-0281", type: "Biometric", title: "Candidate requires review", node: "North Gate · WR-IP-001", age: "24 sec", score: "Stronger candidate", icon: "person", priority: "critical" },
    { id: "ALPR-4142", type: "ALPR", title: "Synthetic fleet candidate", node: "Service Lane · WR-IP-003", age: "3 min", score: "3 observations", icon: "car", priority: "attention" },
    { id: "OBJ-0940", type: "Object", title: "Obstruction observed", node: "North Gate · WR-IP-001", age: "11 min", score: "Reviewable quality", icon: "object", priority: "neutral" },
  ];

  function alerts() {
    return phoneFrame(screenShell(`
      <section class="mobile-title is-inline"><div><span class="eyebrow">Restricted queue</span><h1>3 candidates</h1></div><button class="icon-button surface" aria-label="Filter candidates">${WR().icon("filter", 20)}</button></section>
      <div class="segmented" role="tablist" aria-label="Candidate status"><button class="is-active" role="tab" aria-selected="true">Assigned <em>3</em></button><button role="tab">All</button><button role="tab">Reviewed</button></div>
      <div class="candidate-list">${candidates.map(candidateRow).join("")}</div>
      <div class="queue-footer">${WR().icon("clock", 17)}<span>Oldest candidate: 11 minutes · SLA 15 minutes</span></div>
    `, "alerts"));
  }

  function candidateRow(item) {
    return `<button class="candidate-row" data-action="open-mobile-candidate" data-candidate="${item.id}">
      <span class="candidate-symbol is-${item.priority}">${WR().icon(item.icon, 21)}</span>
      <span class="candidate-copy"><span><em>${item.type}</em><time>${item.age}</time></span><strong>${item.title}</strong><small>${item.node}</small><span class="candidate-meta">${item.score}</span></span>
      ${WR().icon("chevron", 19)}
    </button>`;
  }

  function candidate() {
    return phoneFrame(screenShell(`
      <section class="candidate-hero">
        <div class="candidate-hero-bar"><button class="back-button on-dark" data-route="mobile/alerts" aria-label="Back to alerts">${WR().icon("back", 22)}</button><span class="status-pill is-critical">REVIEW DUE · 14:36</span><button class="icon-button on-dark" aria-label="Candidate actions">${WR().icon("more", 20)}</button></div>
        <div class="synthetic-evidence"><span class="face-silhouette"><i></i></span><span class="crop-grid"></span><span class="evidence-lock">${WR().icon("lock", 16)} Synthetic crop · access logged</span></div>
      </section>
      <section class="candidate-detail">
        <span class="eyebrow">Biometric candidate · BIO-0281</span><h1>Human review required</h1><p class="candidate-warning">This is not an identity determination or authority to act.</p>
        <div class="confidence-band"><div><span>Calibrated band</span><strong>Stronger candidate</strong></div><div class="band-track"><span></span></div><small>Above synthetic review threshold · exact score intentionally omitted</small></div>
        <dl class="detail-list is-boxed"><div><dt>Watchlist reference</dt><dd>SYN-PERSON-0480</dd></div><div><dt>Observations</dt><dd>4 across 2.8 seconds</dd></div><div><dt>Face quality</dt><dd>Reviewable</dd></div><div><dt>Source</dt><dd>WR-IP-001 · North Gate</dd></div><div><dt>Observed</dt><dd>13 Aug 2026 · 14:21:36 CEST</dd></div><div><dt>Evidence expires</dt><dd>17h 42m remaining</dd></div></dl>
        <details class="provenance-disclosure"><summary>Policy, model & provenance ${WR().icon("chevron", 17)}</summary><dl class="detail-list"><div><dt>Authority</dt><dd>BIO-AUTH-SYN-01</dd></div><div><dt>Policy</dt><dd>WR-POLICY-1.4</dd></div><div><dt>Detector</dt><dd>synthetic-detector@0.3</dd></div><div><dt>Embedder</dt><dd>synthetic-embedder@0.2</dd></div><div><dt>Watchlist</dt><dd>SYN-WL-04 · v7</dd></div></dl></details>
        <div class="review-actions"><button class="primary-button is-full" data-action="open-dialog" data-dialog="review-confirm">${WR().icon("check", 18)} Confirm candidate</button><div><button class="secondary-button" data-action="review-inconclusive">Inconclusive</button><button class="secondary-button is-danger-text" data-action="open-dialog" data-dialog="review-reject">Reject</button></div></div>
      </section>
    `, "alerts", { noContext: true, flush: true, noTabs: true }));
  }

  function receipt() {
    const status = WR().state.reviewStatus || "CONFIRMED";
    return phoneFrame(screenShell(`
      <section class="receipt-screen"><span class="receipt-icon">${WR().icon("check", 32)}</span><span class="eyebrow">Review recorded</span><h1>${status === "REJECTED" ? "Candidate rejected" : status === "INCONCLUSIVE" ? "Marked inconclusive" : "Candidate confirmed"}</h1><p>The review outcome is append-only and does not authorize an external response.</p>
        <div class="audit-ticket"><div class="ticket-top"><span>Audit receipt</span><strong>WR-AUD-62091</strong></div><dl class="detail-list"><div><dt>Candidate</dt><dd>BIO-0281</dd></div><div><dt>Outcome</dt><dd>${status}</dd></div><div><dt>Reviewer</dt><dd>Field Operator · AAL2</dd></div><div><dt>Recorded</dt><dd>13 Aug 2026 · 14:23:08 CEST</dd></div><div><dt>Policy</dt><dd>WR-POLICY-1.4</dd></div></dl><div class="ticket-chain">${WR().icon("key", 17)} Audit chain verified · sequence 6,291</div></div>
        <button class="primary-button is-full" data-route="mobile/alerts">Return to candidate queue</button><button class="secondary-button is-full" data-route="mobile/sentry">View node status</button>
      </section>
    `, "alerts", { noTabs: true }));
  }

  function nodes() {
    return phoneFrame(screenShell(`
      <section class="mobile-title is-inline"><div><span class="eyebrow">Deployment fleet</span><h1>4 nodes</h1></div><button class="icon-button surface" data-route="mobile/enroll" aria-label="Enroll new node">${WR().icon("camera", 20)}</button></section>
      <div class="fleet-summary"><div><strong>3</strong><span>Ready</span></div><div><strong>1</strong><span>Degraded</span></div><div><strong>0</strong><span>Offline</span></div></div>
      <div class="node-list">
        ${nodeRow("WR-IP-001", "North Gate", "Sentry active", "healthy", "Now")}
        ${nodeRow("WR-IP-002", "Visitor lane", "Ready", "healthy", "18 sec")}
        ${nodeRow("WR-IP-003", "Service lane", "Thermal fair", "attention", "42 sec")}
        ${nodeRow("WR-IP-004", "Perimeter east", "Ready", "healthy", "1 min")}
      </div>
      <div class="notice-card">${WR().icon("info", 20)}<p>Remote controls can restrict or stop nodes. They can never start an iPhone camera.</p></div>
    `, "nodes"));
  }

  function nodeRow(id, location, status, kind, age) {
    return `<button class="node-row"><span class="node-device">${WR().icon("nodes", 22)}<i class="is-${kind}"></i></span><span><strong>${location}</strong><small>${id} · ${status}</small></span><time>${age}</time>${WR().icon("chevron", 18)}</button>`;
  }

  function more() {
    const groups = [
      ["Deployment", [["shield", "SYNTH-01", "BE-DEFENCE-ADMIN"], ["policy", "Effective policy", "WR-POLICY-1.4"]]],
      ["Security", [["lock", "Session security", "AAL2 · 21 min remaining"], ["key", "Device identity", "P-256 · protected"]]],
      ["Experience", [["eye", "Appearance", "System"], ["settings", "Accessibility", "System settings"]]],
      ["About", [["info", "Prototype limitations", "Synthetic · non-operational"], ["audit", "Open-source notices", "AGPL-3.0"]]],
    ];
    return phoneFrame(screenShell(`
      <section class="mobile-title"><span class="eyebrow">Settings & context</span><h1>More</h1><p>Review deployment, security, accessibility, and prototype information.</p></section>
      ${groups.map(([title, rows]) => `<section class="settings-group"><h2>${title}</h2>${rows.map(([icon, label, meta]) => `<button class="settings-row"><span>${WR().icon(icon, 20)}</span><span><strong>${label}</strong><small>${meta}</small></span>${WR().icon("chevron", 18)}</button>`).join("")}</section>`).join("")}
      <button class="secondary-button is-full is-danger-text" data-route="mobile/signin">Sign out of prototype</button>
      <p class="build-label">WhiteRabbit interactive prototype · build 2026.08.13</p>
    `, "more"));
  }

  function render() {
    const screens = { signin, mfa, enroll, readiness, sentry, alerts, candidate, receipt, nodes, more };
    return (screens[WR().state.mobileScreen] || sentry)();
  }

  function handle(action, target, state, api) {
    if (action === "mobile-signin") api.setRoute("mobile", "mfa");
    if (action === "mobile-mfa") api.setRoute("mobile", "enroll");
    if (action === "accept-enrollment") api.setRoute("mobile", "readiness");
    if (action === "complete-readiness") {
      api.setRoute("mobile", "sentry");
      api.showToast("Node WR-IP-001 enrolled and ready.");
    }
    if (action === "start-sentry") {
      state.sentryRunning = true;
      api.render();
      api.showToast("Sentry Mode active. Camera remains foreground-only.");
    }
    if (action === "toggle-overlay") {
      state.overlay = !state.overlay;
      api.render();
      api.announce(`Diagnostic overlay ${state.overlay ? "shown" : "hidden"}`);
    }
    if (action === "open-mobile-candidate") {
      state.selectedCandidate = target.dataset.candidate;
      api.setRoute("mobile", target.dataset.candidate === "BIO-0281" ? "candidate" : "alerts");
      if (target.dataset.candidate !== "BIO-0281") api.showToast("This detailed path is represented by BIO-0281 in the prototype.");
    }
    if (action === "review-inconclusive") {
      state.reviewStatus = "INCONCLUSIVE";
      api.setRoute("mobile", "receipt");
      api.showToast("Candidate marked inconclusive and audited.");
    }
  }

  window.WhiteRabbitMobile = { render, handle };
})();
