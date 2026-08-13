(function () {
  "use strict";

  const WR = () => window.WhiteRabbit;

  const navigation = [
    ["overview", "overview", "Overview"],
    ["operations", "map", "Operations"],
    ["candidates", "candidates", "Candidates", "3"],
    ["watchlists", "watchlist", "Watchlists"],
    ["nodes", "nodes", "Nodes"],
    ["policies", "policy", "Policies"],
    ["audit", "audit", "Audit"],
  ];

  const events = [
    { id: "EV-8041", candidate: "BIO-0281", type: "Biometric", title: "Candidate requires review", node: "WR-IP-001", zone: "North Gate", age: "24 sec", time: "14:21:36", tone: "critical", icon: "person" },
    { id: "EV-8039", candidate: "ALPR-4142", type: "ALPR", title: "Synthetic fleet candidate", node: "WR-IP-003", zone: "Service Lane", age: "3 min", time: "14:18:09", tone: "attention", icon: "car" },
    { id: "EV-8034", candidate: "OBJ-0940", type: "Object", title: "Obstruction observed", node: "WR-IP-001", zone: "North Gate", age: "11 min", time: "14:10:44", tone: "neutral", icon: "object" },
  ];

  const nodes = [
    { id: "WR-IP-001", name: "North Gate", type: "iPhone 15", state: "Sentry active", health: "healthy", last: "Now", fps: "12.4", battery: "96%" },
    { id: "WR-IP-002", name: "Visitor Lane", type: "iPhone 13", state: "Ready", health: "healthy", last: "18 sec", fps: "—", battery: "External" },
    { id: "WR-IP-003", name: "Service Lane", type: "iPhone 12", state: "Thermal fair", health: "attention", last: "42 sec", fps: "8.1", battery: "78%" },
    { id: "WR-IP-004", name: "Perimeter East", type: "MacBook Air", state: "Ready", health: "healthy", last: "1 min", fps: "—", battery: "External" },
  ];

  function statusDot(tone, label) {
    return `<span class="desk-status is-${tone}"><i></i>${label}</span>`;
  }

  function shell(content) {
    const screen = WR().state.desktopScreen;
    return `
      <section class="desktop-app">
        <aside class="desktop-sidebar">
          <a class="desk-brand" href="#desktop/overview" data-route="desktop/overview" aria-label="WhiteRabbit command center home">
            <span class="brand-mark">${WR().icon("rabbit", 22)}</span><span><strong>WhiteRabbit</strong><small>COMMAND CENTER</small></span>
          </a>
          <div class="deployment-chip"><span class="context-dot"></span><span><strong>SYNTH-01</strong><small>BE-DEFENCE-ADMIN</small></span>${WR().icon("chevron", 15)}</div>
          <nav class="desk-nav" aria-label="Command center navigation">
            <span class="desk-nav-label">Workspace</span>
            ${navigation.map(([route, icon, label, badge]) => `<a href="#desktop/${route}" data-route="desktop/${route}" class="desk-nav-item ${screen === route ? "is-active" : ""}" ${screen === route ? 'aria-current="page"' : ""}>${WR().icon(icon, 18)}<span>${label}</span>${badge ? `<em>${badge}</em>` : ""}</a>`).join("")}
          </nav>
          <div class="desk-sidebar-foot">
            <div class="secure-cell">${WR().icon("shield", 18)}<span><strong>Restricted cell</strong><small>Synthetic environment</small></span>${statusDot("healthy", "")}</div>
            <div class="desk-user"><span class="avatar">FV</span><span><strong>Field Verifier</strong><small>AAL2 · 21 min</small></span><button aria-label="Account menu">${WR().icon("more", 17)}</button></div>
          </div>
        </aside>
        <div class="desktop-main">
          <header class="desk-topbar">
            <div class="breadcrumbs"><span>Operations</span>${WR().icon("chevron", 14)}<strong>${navigation.find(([route]) => route === screen)?.[2] || "Overview"}</strong></div>
            <div class="desk-top-actions">
              <span class="classification-banner">RESTRICTED · SYNTHETIC</span>
              <button class="command-trigger" data-action="open-command">${WR().icon("search", 17)}<span>Search or run command</span><kbd>⌘K</kbd></button>
              <button class="desk-icon-button" aria-label="Notifications">${WR().icon("alert", 17)}<i></i></button>
            </div>
          </header>
          <main class="desk-workspace">${content}</main>
          <footer class="desk-statusbar"><span>${statusDot("healthy", "All systems nominal")}</span><span>Policy WR-POLICY-1.4</span><span>Last sync 4 sec ago</span><span class="statusbar-right">Synthetic records only · No live services</span></footer>
        </div>
        ${WR().state.commandOpen ? commandPalette() : ""}
      </section>`;
  }

  function pageHeading(kicker, title, copy, actions = "") {
    return `<div class="desk-page-heading"><div><span class="desk-kicker">${kicker}</span><h1>${title}</h1><p>${copy}</p></div><div class="desk-page-actions">${actions}</div></div>`;
  }

  function metric(label, value, meta, tone = "neutral", chart = "") {
    return `<article class="metric-card"><div><span>${label}</span>${statusDot(tone, tone === "healthy" ? "Healthy" : tone === "attention" ? "Attention" : "Live")}</div><strong>${value}</strong><small>${meta}</small>${chart ? `<div class="mini-bars">${chart.split("").map((height) => `<i style="height:${Number(height) * 3 + 5}px"></i>`).join("")}</div>` : ""}</article>`;
  }

  function overview() {
    return shell(`
      <div class="desk-page overview-page">
        ${pageHeading("Synthetic Defence administrative pilot", "Operational overview", "Readiness, review pressure, and governed capability at a glance.", `<button class="desk-button" data-route="desktop/operations">Open live workspace ${WR().icon("chevron", 16)}</button>`)}
        <section class="metric-grid" aria-label="Operational metrics">
          ${metric("Operational readiness", "92%", "3 of 4 nodes fully ready", "healthy", "45678987679")}
          ${metric("Active nodes", "3 / 4", "1 node requires attention", "attention", "33456677768")}
          ${metric("Open candidates", "3", "Oldest review due in 4 min", "attention", "23446543234")}
          ${metric("Retention health", "100%", "24h evidence policy enforced", "healthy", "77777777777")}
        </section>
        <section class="overview-grid">
          <article class="desk-panel readiness-panel">
            <div class="panel-heading"><div><span class="desk-kicker">Last 12 hours</span><h2>Candidate volume</h2></div><div class="legend"><span><i class="is-blue"></i>ALPR</span><span><i class="is-amber"></i>Object</span><span><i class="is-red"></i>Biometric</span></div></div>
            <div class="volume-chart" role="img" aria-label="Synthetic candidate volume over 12 hours">
              <div class="chart-grid-lines"></div>
              <svg viewBox="0 0 700 190" preserveAspectRatio="none" aria-hidden="true"><path class="chart-area" d="M0 166 C90 165 100 130 175 142 S265 72 350 105 S430 82 520 90 S610 35 700 54 L700 190 L0 190Z"/><path class="chart-line" d="M0 166 C90 165 100 130 175 142 S265 72 350 105 S430 82 520 90 S610 35 700 54"/><circle cx="700" cy="54" r="5"/></svg>
              <div class="chart-axis"><span>02:00</span><span>06:00</span><span>10:00</span><span>14:00</span></div>
            </div>
          </article>
          <article class="desk-panel attention-panel">
            <div class="panel-heading"><div><span class="desk-kicker">Operator attention</span><h2>Needs action</h2></div><button class="desk-link" data-route="desktop/candidates">View queue</button></div>
            ${attentionRow("critical", "BIO-0281", "Candidate review due", "4 min remaining")}
            ${attentionRow("attention", "WR-IP-003", "Thermal state fair", "Since 14:18")}
            ${attentionRow("neutral", "SYN-WL-04", "Package expires soon", "5 days")}
          </article>
        </section>
        <section class="desk-panel fleet-panel">
          <div class="panel-heading"><div><span class="desk-kicker">Deployment fleet</span><h2>Node readiness</h2></div><button class="desk-link" data-route="desktop/nodes">Manage nodes</button></div>
          ${nodeTable(nodes.slice(0, 4))}
        </section>
      </div>`);
  }

  function attentionRow(tone, id, title, meta) {
    return `<button class="attention-row" data-route="desktop/${id.startsWith("BIO") ? "candidates" : id.startsWith("WR-") ? "nodes" : "watchlists"}"><span class="attention-symbol is-${tone}">${WR().icon(tone === "critical" ? "person" : tone === "attention" ? "temperature" : "watchlist", 18)}</span><span><small>${id}</small><strong>${title}</strong></span><time>${meta}</time>${WR().icon("chevron", 16)}</button>`;
  }

  function operations() {
    const active = events.find((event) => event.id === WR().state.selectedEvent) || events[0];
    return shell(`
      <section class="operations-layout">
        <header class="operations-toolbar">
          <div><span class="desk-kicker">SYNTH-01</span><h1>Operations workspace</h1></div>
          <div class="ops-controls"><button class="desk-filter is-active">Live · 3</button><button class="desk-filter">Last hour</button><button class="desk-filter">All modalities</button><button class="desk-icon-button" aria-label="Workspace settings">${WR().icon("settings", 17)}</button></div>
        </header>
        <aside class="event-rail">
          <div class="rail-heading"><span>Event stream</span><small>3 open</small></div>
          ${events.map(event => eventRow(event, active.id === event.id)).join("")}
          <div class="rail-footer">${WR().icon("lock", 14)} Exact positions restricted</div>
        </aside>
        <section class="tactical-map" aria-label="Fictional synthetic operations map">
          <div class="map-underlay"></div><div class="map-road road-a"></div><div class="map-road road-b"></div><div class="map-building building-a">ADMIN A</div><div class="map-building building-b">SERVICE</div><div class="map-zone"><span>APPROVED CAPTURE ZONE</span></div>
          ${mapNode("WR-IP-001", "35%", "36%", "healthy", active.node === "WR-IP-001")}
          ${mapNode("WR-IP-002", "70%", "25%", "healthy", false)}
          ${mapNode("WR-IP-003", "68%", "71%", "attention", active.node === "WR-IP-003")}
          ${mapNode("WR-IP-004", "25%", "76%", "healthy", false)}
          <div class="map-compass">N<span></span></div>
          <div class="map-controls"><button aria-label="Zoom in">+</button><button aria-label="Zoom out">−</button><button aria-label="Recenter map">${WR().icon("map", 17)}</button></div>
          <div class="map-legend"><span>${statusDot("healthy", "Node")}</span><span>${statusDot("critical", "Review due")}</span><span>FICTIONAL SITE · NOT TO SCALE</span></div>
        </section>
        <aside class="event-inspector">${eventInspector(active)}</aside>
        <section class="operations-timeline">
          <div class="timeline-head"><div><span class="desk-kicker">Correlated activity</span><h2>Timeline</h2></div><div><button class="desk-link">Pause</button><button class="desk-link">Export view</button></div></div>
          <div class="timeline-track"><span class="timeline-now">NOW</span>${events.map((event, index) => `<button class="timeline-point is-${event.tone} ${event.id === active.id ? "is-active" : ""}" style="left:${24 + index * 25}%" data-action="select-event" data-event="${event.id}" aria-label="${event.id} at ${event.time}"><i></i><small>${event.time}</small></button>`).join("")}</div>
        </section>
      </section>`);
  }

  function eventRow(event, selected) {
    return `<button class="event-row ${selected ? "is-selected" : ""}" data-action="select-event" data-event="${event.id}"><span class="event-icon is-${event.tone}">${WR().icon(event.icon, 17)}</span><span><span><em>${event.type}</em><time>${event.age}</time></span><strong>${event.title}</strong><small>${event.zone} · ${event.node}</small></span></button>`;
  }

  function mapNode(id, left, top, health, selected) {
    return `<button class="map-node is-${health} ${selected ? "is-selected" : ""}" style="left:${left};top:${top}" data-action="select-node-on-map" data-node="${id}" aria-label="Select node ${id}">${WR().icon("camera", 16)}<span>${id}</span></button>`;
  }

  function eventInspector(event) {
    const reviewed = event.id === "EV-8041" && WR().state.desktopReviewStatus;
    return `<div class="inspector-head"><div><span class="desk-kicker">Selected event</span><h2>${event.id}</h2></div>${statusDot(reviewed ? "healthy" : event.tone, reviewed ? WR().state.desktopReviewStatus : "Open")}</div>
      <div class="inspector-evidence is-${event.icon}">${event.icon === "person" ? '<span class="face-silhouette"><i></i></span>' : WR().icon(event.icon, 42)}<small>${WR().icon("lock", 13)} Synthetic evidence · access logged</small></div>
      <div class="inspector-warning">${WR().icon("info", 16)}<p>${event.type === "Biometric" ? "A candidate is not an identity determination or authority to act." : "Human review is required before this candidate can change state."}</p></div>
      <dl class="desk-detail-list"><div><dt>Type</dt><dd>${event.type}</dd></div><div><dt>Source</dt><dd>${event.node}</dd></div><div><dt>Zone</dt><dd>${event.zone}</dd></div><div><dt>Observed</dt><dd>13 Aug · ${event.time}</dd></div><div><dt>Evidence TTL</dt><dd>17h 42m</dd></div><div><dt>Policy</dt><dd>WR-POLICY-1.4</dd></div></dl>
      <details class="desk-disclosure" open><summary>Provenance ${WR().icon("chevron", 15)}</summary><div><span>Model package</span><strong>synthetic-suite@0.3</strong><span>Authority</span><strong>BIO-AUTH-SYN-01</strong><span>Event proof</span><strong>ES256 · verified</strong></div></details>
      <button class="desk-button is-full" data-route="desktop/candidates">Open review workspace</button>`;
  }

  function candidates() {
    const reviewed = WR().state.desktopReviewStatus;
    return shell(`<div class="desk-page candidates-page">
      ${pageHeading("Restricted human-review queue", "Candidates", "Correlated synthetic observations awaiting an accountable human outcome.", `<button class="desk-button is-secondary">${WR().icon("filter", 16)} Filter</button><button class="desk-button is-secondary">Assign</button>`)}
      <div class="candidate-workspace">
        <section class="candidate-table-panel">
          <div class="table-tools"><div class="desk-search">${WR().icon("search", 16)}<input aria-label="Search candidates" placeholder="Search candidate reference" /></div><div class="density-switch"><button class="${WR().state.density === "comfortable" ? "is-active" : ""}" data-action="set-density" data-density="comfortable">Comfortable</button><button class="${WR().state.density === "compact" ? "is-active" : ""}" data-action="set-density" data-density="compact">Compact</button></div></div>
          <div class="desk-table candidate-table"><div class="desk-table-head"><span>Priority</span><span>Candidate</span><span>Modality</span><span>Source</span><span>Age</span><span>Status</span></div>
            ${events.map((event) => `<button class="desk-table-row ${WR().state.selectedEvent === event.id ? "is-selected" : ""}" data-action="select-event" data-event="${event.id}"><span>${statusDot(event.tone, event.tone === "critical" ? "P1" : event.tone === "attention" ? "P2" : "P3")}</span><span><strong>${event.candidate}</strong><small>${event.title}</small></span><span>${event.type}</span><span>${event.node}</span><span>${event.age}</span><span>${event.id === "EV-8041" && reviewed ? statusDot("healthy", reviewed) : statusDot("attention", "Review")}</span></button>`).join("")}
          </div>
        </section>
        <aside class="candidate-review-panel">${candidateReview(events.find((event) => event.id === WR().state.selectedEvent) || events[0])}</aside>
      </div>
    </div>`);
  }

  function candidateReview(event) {
    const isBio = event.icon === "person";
    const reviewed = event.id === "EV-8041" && WR().state.desktopReviewStatus;
    return `<div class="review-panel-head"><div><span class="desk-kicker">${event.type} candidate</span><h2>${event.candidate}</h2></div>${statusDot(reviewed ? "healthy" : event.tone, reviewed || "Review due")}</div>
      <div class="review-visual is-${event.icon}">${isBio ? '<span class="face-silhouette"><i></i></span>' : WR().icon(event.icon, 52)}<span>${WR().icon("lock", 13)} GENERATED EVIDENCE</span></div>
      <h3>${reviewed ? `Review recorded: ${reviewed}` : "Human review required"}</h3><p class="review-caution">${isBio ? "This is not an identity determination or authority to act." : "No candidate is confirmed without accountable human review."}</p>
      <div class="confidence-band desk-confidence"><div><span>Calibrated band</span><strong>${isBio ? "Stronger candidate" : "Reviewable"}</strong></div><div class="band-track"><span></span></div><small>Exact score intentionally omitted from the decision surface</small></div>
      <dl class="desk-detail-list"><div><dt>Observations</dt><dd>${isBio ? "4 across 2.8 sec" : "3 correlated"}</dd></div><div><dt>Reference</dt><dd>${isBio ? "SYN-PERSON-0480" : "SYN-FLEET-021"}</dd></div><div><dt>Watchlist</dt><dd>SYN-WL-04 · v7</dd></div><div><dt>Evidence expires</dt><dd>17h 42m</dd></div></dl>
      ${reviewed ? `<div class="reviewed-banner">${WR().icon("check", 18)}<span><strong>Append-only outcome recorded</strong><small>Audit sequence 6,291 · Field Verifier · AAL2</small></span></div>` : `<div class="desktop-review-actions"><button class="desk-button" data-action="open-dialog" data-dialog="review-confirm">Confirm candidate</button><button class="desk-button is-secondary" data-action="desktop-inconclusive">Inconclusive</button><button class="desk-button is-danger-quiet" data-action="open-dialog" data-dialog="review-reject">Reject</button></div>`}`;
  }

  function watchlists() {
    return shell(`<div class="desk-page">
      ${pageHeading("Governed biometric capability", "Watchlists", "Tenant-scoped packages with explicit authority, purpose, model, node, and expiry constraints.", `<button class="desk-button" data-action="propose-watchlist">Propose new version</button>`)}
      <div class="governance-banner">${WR().icon("shield", 20)}<div><strong>Maker-checker is enforced in this prototype</strong><span>The proposer cannot approve, activate, or distribute their own package.</span></div><span>FAIL CLOSED</span></div>
      <section class="watchlist-grid">
        <article class="desk-panel watchlist-list"><div class="panel-heading"><div><span class="desk-kicker">Active & proposed</span><h2>2 packages</h2></div><button class="desk-icon-button">${WR().icon("filter", 16)}</button></div>
          ${watchlistRow("SYN-WL-04", "Administrative access roster", "Active", "healthy", "480 generated identities")}
          ${watchlistRow("SYN-WL-05", "Roster correction", "Awaiting approval", "attention", "+12 / −3 changes")}
        </article>
        <article class="desk-panel watchlist-detail">
          <div class="panel-heading"><div><span class="desk-kicker">Selected package</span><h2>${WR().state.selectedWatchlist}</h2></div>${statusDot(WR().state.selectedWatchlist === "SYN-WL-04" ? "healthy" : "attention", WR().state.selectedWatchlist === "SYN-WL-04" ? "Active" : "Awaiting approval")}</div>
          <p>Fictional administrative access subjects for local 1:N benchmark and governed alert-flow validation.</p>
          <dl class="desk-detail-list"><div><dt>Controller profile</dt><dd>BE-DEFENCE-ADMIN</dd></div><div><dt>Purpose</dt><dd>Synthetic pilot validation</dd></div><div><dt>Authority</dt><dd>BIO-AUTH-SYN-01</dd></div><div><dt>Biometric mode</dt><dd>IDENTIFICATION_1_N</dd></div><div><dt>Model digest</dt><dd>sha256:synthetic…c12e</dd></div><div><dt>Allowed nodes</dt><dd>WR-IP-001, WR-IP-003</dd></div><div><dt>Expires</dt><dd>18 Aug 2026 · 14:00</dd></div></dl>
          <div class="package-signers"><span>${WR().icon("usercheck", 18)}<strong>Proposed by</strong><small>A. Vermeer · 12 Aug</small></span><span>${WR().icon("check", 18)}<strong>Approved by</strong><small>B. Janssens · 12 Aug</small></span></div>
          <div class="desktop-review-actions"><button class="desk-button is-secondary" data-action="inspect-package">Inspect manifest</button><button class="desk-button is-danger-quiet" data-action="revoke-watchlist">Revoke package</button></div>
        </article>
      </section>
    </div>`);
  }

  function watchlistRow(id, title, state, tone, meta) {
    return `<button class="watchlist-row ${WR().state.selectedWatchlist === id ? "is-selected" : ""}" data-action="select-watchlist" data-watchlist="${id}"><span class="watchlist-icon">${WR().icon("watchlist", 19)}</span><span><small>${id}</small><strong>${title}</strong><em>${meta}</em></span>${statusDot(tone, state)}${WR().icon("chevron", 16)}</button>`;
  }

  function nodeTable(items) {
    return `<div class="desk-table node-table"><div class="desk-table-head"><span>Node</span><span>Device</span><span>Status</span><span>Last seen</span><span>Sampling</span><span>Power</span></div>${items.map((node) => `<button class="desk-table-row" data-action="select-node" data-node="${node.id}"><span><strong>${node.name}</strong><small>${node.id}</small></span><span>${node.type}</span><span>${statusDot(node.health, node.state)}</span><span>${node.last}</span><span>${node.fps === "—" ? "—" : `${node.fps} fps`}</span><span>${node.battery}</span></button>`).join("")}</div>`;
  }

  function nodePage() {
    const active = nodes.find((node) => node.id === WR().state.selectedNode) || nodes[0];
    return shell(`<div class="desk-page">
      ${pageHeading("Deployment fleet", "Nodes", "Revocable device identities, authority-package state, and field health.", `<button class="desk-button is-secondary">${WR().icon("download", 16)} Export inventory</button><button class="desk-button">Create enrollment claim</button>`)}
      <div class="nodes-layout"><section class="desk-panel"><div class="panel-heading"><div><span class="desk-kicker">Fleet health</span><h2>4 registered nodes</h2></div><div class="legend">${statusDot("healthy", "3 ready")} ${statusDot("attention", "1 attention")}</div></div>${nodeTable(nodes)}</section>
      <aside class="desk-panel node-inspector"><div class="node-hero"><span class="large-node-icon">${WR().icon("nodes", 28)}<i class="is-${active.health}"></i></span><div><span class="desk-kicker">${active.id}</span><h2>${active.name}</h2><p>${active.type} · iOS development build</p></div></div><dl class="desk-detail-list"><div><dt>Operating state</dt><dd>${active.state}</dd></div><div><dt>Device proof</dt><dd>P-256 · verified</dd></div><div><dt>Policy package</dt><dd>WR-POLICY-1.4</dd></div><div><dt>Watchlist package</dt><dd>SYN-WL-04 · v7</dd></div><div><dt>Camera permission</dt><dd>Foreground only</dd></div><div><dt>Evidence outbox</dt><dd>2 encrypted records</dd></div></dl><div class="node-command-note">${WR().icon("info", 17)}<p>Remote controls may restrict or stop a node. They can never start an iPhone camera.</p></div><button class="desk-button is-danger-quiet is-full" data-action="remote-stop-node">Stop node locally</button></aside></div>
    </div>`);
  }

  function policies() {
    return shell(`<div class="desk-page">
      ${pageHeading("Effective controls", "Policies", "The immutable policy currently governing this deployment and every signed event.", `<button class="desk-button is-secondary" data-action="compare-policy">Compare revision</button><button class="desk-button" data-action="propose-policy">Propose change</button>`)}
      <section class="policy-layout"><article class="desk-panel policy-summary"><div class="policy-mark">${WR().icon("policy", 26)}</div><span class="desk-kicker">Effective revision</span><h2>WR-POLICY-1.4</h2><p>Defence administrative site-security synthetic validation profile.</p><div class="policy-meta">${statusDot("healthy", "Signed & active")}<span>Effective 12 Aug 2026</span><span>Expires 18 Aug 2026</span></div><dl class="desk-detail-list"><div><dt>Profile</dt><dd>BE-DEFENCE-ADMIN</dd></div><div><dt>Classification</dt><dd>RESTRICTED · SYNTHETIC</dd></div><div><dt>Public projection</dt><dd>PROHIBITED</dd></div><div><dt>Raw video upload</dt><dd>PROHIBITED</dd></div><div><dt>Candidate evidence</dt><dd>24 hours maximum</dd></div><div><dt>Federation</dt><dd>DISABLED</dd></div></dl></article>
      <article class="desk-panel capability-matrix"><div class="panel-heading"><div><span class="desk-kicker">Capability matrix</span><h2>Allowed actions by role</h2></div><span>Read-only effective view</span></div><div class="matrix"><div class="matrix-head"><span>Capability</span><span>Operator</span><span>Reviewer</span><span>Admin</span></div>${matrixRow("Operate own node", true, false, false)}${matrixRow("View assigned candidates", true, true, true)}${matrixRow("Record review outcome", false, true, true)}${matrixRow("Propose watchlist", false, false, true)}${matrixRow("Approve own proposal", false, false, false)}${matrixRow("Remote start camera", false, false, false)}${matrixRow("Public projection", false, false, false)}</div><div class="policy-history"><h3>Revision history</h3>${historyRow("1.4", "Retention reduced to 24h", "B. Janssens", "12 Aug")}${historyRow("1.3", "Node scope restricted", "L. Peeters", "10 Aug")}${historyRow("1.2", "Synthetic model suite updated", "A. Vermeer", "09 Aug")}</div></article></section>
    </div>`);
  }

  function matrixRow(label, operator, reviewer, admin) {
    const mark = (allowed) => `<span class="matrix-mark ${allowed ? "is-yes" : "is-no"}">${WR().icon(allowed ? "check" : "close", 15)}<span class="sr-only">${allowed ? "Allowed" : "Not allowed"}</span></span>`;
    return `<div class="matrix-row"><strong>${label}</strong>${mark(operator)}${mark(reviewer)}${mark(admin)}</div>`;
  }

  function historyRow(version, change, actor, date) {
    return `<div class="history-row"><span>${version}</span><strong>${change}</strong><small>${actor}</small><time>${date}</time></div>`;
  }

  function audit() {
    const records = [
      ["14:23:08", "Candidate review", "BIO-0281 · CONFIRMED", "Field Verifier", "6,291", "healthy"],
      ["14:21:41", "Evidence accessed", "EV-8041 · 5-minute grant", "Field Verifier", "6,290", "neutral"],
      ["14:21:36", "Candidate ingested", "BIO-0281 · ES256 verified", "WR-IP-001", "6,289", "critical"],
      ["14:18:09", "Candidate ingested", "ALPR-4142 · ES256 verified", "WR-IP-003", "6,288", "attention"],
      ["14:16:54", "Node heartbeat", "WR-IP-003 · thermal fair", "WR-IP-003", "6,287", "attention"],
      ["14:10:44", "Candidate ingested", "OBJ-0940 · ES256 verified", "WR-IP-001", "6,286", "neutral"],
    ];
    return shell(`<div class="desk-page audit-page">
      ${pageHeading("Append-evident accountability", "Audit", "Searchable synthetic actions, policy decisions, and signed system events.", `<button class="desk-button is-secondary" data-action="verify-chain">${WR().icon("key", 16)} Verify chain</button><button class="desk-button" data-action="export-audit">${WR().icon("download", 16)} Prepare export</button>`)}
      <div class="audit-health"><div class="audit-orb">${WR().icon("check", 26)}</div><div><span class="desk-kicker">Integrity status</span><h2>Chain verified through sequence 6,291</h2><p>Last validation 8 seconds ago · no gaps, mutations, or signature failures.</p></div><dl><div><dt>Records today</dt><dd>1,204</dd></div><div><dt>Export classification</dt><dd>RESTRICTED</dd></div><div><dt>Clock skew</dt><dd>18 ms max</dd></div></dl></div>
      <section class="desk-panel audit-stream"><div class="table-tools"><div class="desk-search">${WR().icon("search", 16)}<input aria-label="Search audit events" placeholder="Search actor, event, or sequence" /></div><div class="ops-controls"><button class="desk-filter is-active">All events</button><button class="desk-filter">Human actions</button><button class="desk-filter">System</button></div></div><div class="audit-table"><div class="audit-table-head"><span>Time</span><span>Event</span><span>Subject</span><span>Actor</span><span>Sequence</span><span>Integrity</span></div>${records.map(([time, event, subject, actor, sequence, tone]) => `<button class="audit-row"><time>${time}</time><strong>${event}</strong><span>${subject}</span><span>${actor}</span><span class="mono">${sequence}</span><span>${statusDot(tone === "critical" ? "healthy" : tone, "Verified")}</span></button>`).join("")}</div></section>
    </div>`);
  }

  function commandPalette() {
    return `<div class="command-backdrop" data-action="close-command"><section class="command-palette" role="dialog" aria-modal="true" aria-label="Command palette" data-command-panel><div class="command-input">${WR().icon("search", 19)}<input aria-label="Search commands" placeholder="Search screens or commands…" autofocus /><kbd>ESC</kbd></div><div class="command-section"><span>Navigate</span>${navigation.map(([route, icon, label], index) => `<button data-action="command-route" data-screen="${route}">${WR().icon(icon, 17)}<span><strong>${label}</strong><small>Open ${label.toLowerCase()} workspace</small></span>${index < 3 ? `<kbd>↵</kbd>` : ""}</button>`).join("")}</div><div class="command-footer"><span>Prototype commands use generated data only.</span><span><kbd>↑↓</kbd> Navigate <kbd>↵</kbd> Open</span></div></section></div>`;
  }

  function render() {
    const screens = { overview, operations, candidates, watchlists, nodes: nodePage, policies, audit };
    return (screens[WR().state.desktopScreen] || overview)();
  }

  function handle(action, target, state, api) {
    if (action === "select-event") {
      state.selectedEvent = target.dataset.event;
      api.render();
    }
    if (action === "select-node-on-map") {
      state.selectedNode = target.dataset.node;
      api.showToast(`${state.selectedNode} selected. Exact coordinates remain restricted.`);
    }
    if (action === "select-node") {
      state.selectedNode = target.dataset.node;
      api.setRoute("desktop", "nodes");
    }
    if (action === "select-watchlist") {
      state.selectedWatchlist = target.dataset.watchlist;
      api.render();
    }
    if (action === "set-density") {
      state.density = target.dataset.density;
      api.render();
      api.announce(`${state.density} table density selected`);
    }
    if (action === "open-command") openCommand(state, api.render);
    if (action === "close-command" && !target.hasAttribute("data-command-panel")) {
      state.commandOpen = false;
      api.render();
    }
    if (action === "command-route") {
      state.commandOpen = false;
      api.setRoute("desktop", target.dataset.screen);
    }
    if (action === "desktop-inconclusive") {
      state.desktopReviewStatus = "INCONCLUSIVE";
      api.render();
      api.showToast("Candidate marked inconclusive and added to the audit chain.");
    }
    const toastActions = {
      "propose-watchlist": "Draft watchlist version created. A separate approver is required.",
      "inspect-package": "Synthetic signed manifest opened in read-only mode.",
      "revoke-watchlist": "Revocation workflow opened. No package was changed.",
      "remote-stop-node": "Remote stop requires step-up confirmation. No node was contacted.",
      "compare-policy": "Policy comparison opened for revisions 1.3 and 1.4.",
      "propose-policy": "Draft policy change created. Effective policy remains immutable.",
      "verify-chain": "Audit chain verified through sequence 6,291.",
      "export-audit": "Restricted export prepared locally with synthetic records only.",
    };
    if (toastActions[action]) api.showToast(toastActions[action]);
  }

  function openCommand(state, render) {
    state.commandOpen = true;
    render();
    window.setTimeout(() => document.querySelector(".command-input input")?.focus(), 0);
  }

  window.WhiteRabbitDesktop = { render, handle, openCommand };
})();
