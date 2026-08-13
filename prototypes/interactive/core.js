(function () {
  "use strict";

  const ICONS = {
    rabbit: '<path d="M8.2 8.4C5.8 5.2 5.2 2.8 6.7 2.2c1.5-.6 3.2 1.9 4.1 5.2M15.8 8.4c2.4-3.2 3-5.6 1.5-6.2-1.5-.6-3.2 1.9-4.1 5.2"/><path d="M5.7 14.2c0-4.2 2.5-7 6.3-7s6.3 2.8 6.3 7c0 4.5-2.3 7.3-6.3 7.3s-6.3-2.8-6.3-7.3Z"/><path d="M9.4 13.5h.1M14.5 13.5h.1M10 17c1.3.9 2.7.9 4 0"/>',
    sentry: '<path d="M4 8.5 12 4l8 4.5v6c0 3.7-3 5.8-8 7.5-5-1.7-8-3.8-8-7.5v-6Z"/><path d="M9 13.5a3 3 0 1 0 6 0 3 3 0 0 0-6 0Z"/><path d="M12 10.5v3l2 1"/>',
    alert: '<path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.5h.01"/>',
    nodes: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M9 6h6M10 17h4M7 10h10v4H7z"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    back: '<path d="m15 18-6-6 6-6"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    camera: '<path d="M5 7h3l1.2-2h5.6L16 7h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z"/><circle cx="12" cy="13" r="3.5"/>',
    wifi: '<path d="M3 9c5-4 13-4 18 0M6.5 13c3.2-2.6 7.8-2.6 11 0M10 17c1.2-.8 2.8-.8 4 0M12 20h.01"/>',
    bolt: '<path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z"/>',
    temperature: '<path d="M10 14.8V5a2 2 0 1 1 4 0v9.8a4 4 0 1 1-4 0Z"/><path d="M12 9v7"/>',
    database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>',
    shield: '<path d="M12 3 4 6v5c0 5.2 3.2 8.3 8 10 4.8-1.7 8-4.8 8-10V6l-8-3Z"/><path d="m8.5 12 2.3 2.3 4.7-5"/>',
    person: '<circle cx="12" cy="8" r="3"/><path d="M5 21c.8-4.5 3-7 7-7s6.2 2.5 7 7"/>',
    car: '<path d="m5 11 2-5h10l2 5M4 11h16v7H4zM7 18v2M17 18v2"/><circle cx="7.5" cy="14.5" r="1"/><circle cx="16.5" cy="14.5" r="1"/>',
    object: '<path d="m12 2 8 4.5v10L12 22l-8-5.5v-10L12 2Z"/><path d="m4 6.5 8 5 8-5M12 11.5V22"/>',
    eye: '<path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.8 1.8 0 0 0 .4 2l.1.1-2.8 2.8-.1-.1a1.8 1.8 0 0 0-2-.4 1.8 1.8 0 0 0-1.1 1.6v.2h-4V21A1.8 1.8 0 0 0 9 19.4a1.8 1.8 0 0 0-2 .4l-.1.1-2.8-2.8.1-.1a1.8 1.8 0 0 0 .4-2A1.8 1.8 0 0 0 3 13.9h-.2v-4H3A1.8 1.8 0 0 0 4.6 9a1.8 1.8 0 0 0-.4-2l-.1-.1 2.8-2.8.1.1a1.8 1.8 0 0 0 2 .4A1.8 1.8 0 0 0 10.1 3v-.2h4V3a1.8 1.8 0 0 0 1.1 1.6 1.8 1.8 0 0 0 2-.4l.1-.1 2.8 2.8-.1.1a1.8 1.8 0 0 0-.4 2 1.8 1.8 0 0 0 1.6 1.1h.2v4h-.2a1.8 1.8 0 0 0-1.8 1Z"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    candidates: '<path d="M4 5h16v14H4zM8 9h8M8 13h5"/>',
    watchlist: '<path d="M7 3h10v4H7zM5 5H3v16h18V5h-2M8 12h8M8 16h5"/>',
    policy: '<path d="M6 3h9l3 3v15H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    audit: '<path d="M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"/>',
    overview: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    command: '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m8 10 3 2-3 2M13 15h4"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
    download: '<path d="M12 3v12m0 0 4-4m-4 4-4-4M4 20h16"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M15 8l2 2M18 5l2 2"/>',
    usercheck: '<circle cx="9" cy="8" r="3"/><path d="M3 20c.7-4 2.7-6 6-6 2 0 3.6.7 4.6 2M15 18l2 2 4-5"/>',
  };

  const state = {
    mode: "mobile",
    mobileScreen: "signin",
    mobileTab: "sentry",
    desktopScreen: "overview",
    sentryRunning: false,
    overlay: false,
    reviewStatus: null,
    selectedCandidate: "BIO-0281",
    selectedEvent: "EV-8041",
    selectedNode: "WR-IP-001",
    selectedWatchlist: "SYN-WL-04",
    commandOpen: false,
    desktopReviewStatus: null,
    density: "comfortable",
    dialog: null,
    toast: null,
  };

  const app = document.getElementById("app");
  const live = document.getElementById("prototype-live");

  function icon(name, size = 20) {
    return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.info}</svg>`;
  }

  function announce(message) {
    live.textContent = "";
    window.setTimeout(() => {
      live.textContent = message;
    }, 30);
  }

  function setRoute(mode, screen) {
    state.mode = mode;
    if (mode === "mobile") state.mobileScreen = screen || "sentry";
    if (mode === "desktop") state.desktopScreen = screen || "overview";
    const nextHash = `#${mode}/${screen || (mode === "mobile" ? "sentry" : "overview")}`;
    if (window.location.hash !== nextHash) window.history.pushState(null, "", nextHash);
    render();
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  function parseRoute() {
    const route = window.location.hash.replace(/^#/, "").split("/");
    if (route[0] === "desktop") {
      state.mode = "desktop";
      state.desktopScreen = route[1] || "overview";
    } else if (route[0] === "mobile") {
      state.mode = "mobile";
      state.mobileScreen = route[1] || "signin";
    }
  }

  function prototypeChrome(content) {
    return `
      <div class="prototype-shell" data-density="${state.density}">
        <header class="prototype-bar">
          <a class="prototype-brand" href="#mobile/signin" data-route="mobile/signin" aria-label="WhiteRabbit prototype home">
            <span class="brand-mark">${icon("rabbit", 23)}</span>
            <span><strong>WhiteRabbit</strong><small>interactive synthetic prototype</small></span>
          </a>
          <div class="mode-switcher" role="group" aria-label="Prototype viewport">
            <button class="mode-button ${state.mode === "mobile" ? "is-active" : ""}" data-mode="mobile" aria-pressed="${state.mode === "mobile"}">Mobile</button>
            <button class="mode-button ${state.mode === "desktop" ? "is-active" : ""}" data-mode="desktop" aria-pressed="${state.mode === "desktop"}">Desktop</button>
          </div>
          <div class="prototype-actions">
            <span class="synthetic-flag"><span></span>Synthetic data</span>
            <button class="text-button" data-action="reset-prototype">Reset flow</button>
          </div>
        </header>
        <main id="prototype-stage" class="prototype-stage" tabindex="-1">${content}</main>
        ${state.toast ? `<div class="toast" aria-hidden="true"><span class="toast-icon">${icon("check", 18)}</span><span>${state.toast}</span></div>` : ""}
        ${state.dialog ? window.WhiteRabbit.renderDialog(state.dialog) : ""}
      </div>`;
  }

  function showToast(message) {
    state.toast = message;
    announce(message);
    render();
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      state.toast = null;
      render();
    }, 3500);
  }

  function renderDialog(dialog) {
    const configs = {
      "stop-sentry": {
        title: "Stop Sentry Mode?",
        copy: "Capture and local inference stop immediately. Queued signed events remain encrypted and will retry when connectivity allows.",
        confirm: "Stop Sentry",
        danger: true,
      },
      "review-confirm": {
        title: "Confirm this candidate?",
        copy: "This records a human review outcome. It does not establish identity or authorize an operational response.",
        confirm: "Confirm candidate",
      },
      "review-reject": {
        title: "Reject this candidate?",
        copy: "The candidate will be marked rejected and the decision will be added to the append-evident audit trail.",
        confirm: "Reject candidate",
        danger: true,
      },
      "evidence-grant": {
        title: "Request temporary evidence access",
        copy: "A single-purpose grant will unlock the synthetic crop for 5 minutes. Viewing is logged and the evidence still expires in 17h 42m.",
        confirm: "Request access",
      },
    };
    const data = configs[dialog] || configs["evidence-grant"];
    return `
      <div class="dialog-backdrop" data-action="close-dialog">
        <section class="dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" data-dialog-panel>
          <button class="icon-button dialog-close" data-action="close-dialog" aria-label="Close dialog">${icon("close", 20)}</button>
          <span class="dialog-symbol ${data.danger ? "is-danger" : ""}">${icon(data.danger ? "alert" : "shield", 24)}</span>
          <h2 id="dialog-title">${data.title}</h2>
          <p>${data.copy}</p>
          <dl class="dialog-context"><div><dt>Deployment</dt><dd>BE-DEFENCE-ADMIN · SYNTH-01</dd></div><div><dt>Classification</dt><dd>RESTRICTED · SYNTHETIC</dd></div></dl>
          <div class="dialog-actions">
            <button class="secondary-button" data-action="close-dialog">Cancel</button>
            <button class="primary-button ${data.danger ? "is-danger" : ""}" data-action="confirm-dialog" data-dialog="${dialog}">${data.confirm}</button>
          </div>
        </section>
      </div>`;
  }

  function reset() {
    Object.assign(state, {
      mobileScreen: "signin",
      mobileTab: "sentry",
      desktopScreen: "overview",
      sentryRunning: false,
      overlay: false,
      reviewStatus: null,
      selectedCandidate: "BIO-0281",
      selectedEvent: "EV-8041",
      selectedNode: "WR-IP-001",
      selectedWatchlist: "SYN-WL-04",
      commandOpen: false,
      desktopReviewStatus: null,
      dialog: null,
      toast: null,
    });
    setRoute(state.mode, state.mode === "mobile" ? "signin" : "overview");
    announce("Prototype reset");
  }

  function render() {
    const view = state.mode === "mobile" ? window.WhiteRabbitMobile.render() : window.WhiteRabbitDesktop.render();
    app.innerHTML = prototypeChrome(view);
  }

  function handleClick(event) {
    const target = event.target.closest("button, a, [data-action], [data-route]");
    if (!target) return;

    const route = target.dataset.route;
    if (route) {
      event.preventDefault();
      const [mode, screen] = route.split("/");
      setRoute(mode, screen);
      return;
    }

    if (target.dataset.mode) {
      setRoute(target.dataset.mode, target.dataset.mode === "mobile" ? "sentry" : "overview");
      return;
    }

    const action = target.dataset.action;
    if (!action) return;

    if (action === "close-dialog" && event.target.closest("[data-dialog-panel]")) return;
    if (action === "close-command" && event.target.closest("[data-command-panel]")) return;

    if (action === "reset-prototype") reset();
    if (action === "open-dialog") {
      state.dialog = target.dataset.dialog;
      render();
      window.setTimeout(() => document.querySelector(".dialog-close")?.focus(), 0);
    }
    if (action === "close-dialog") {
      state.dialog = null;
      render();
    }
    if (action === "confirm-dialog") {
      const dialog = target.dataset.dialog;
      state.dialog = null;
      if (dialog === "stop-sentry") {
        state.sentryRunning = false;
        state.mobileScreen = "sentry";
        showToast("Sentry Mode stopped. Camera released.");
      } else if (dialog === "evidence-grant") {
        showToast("Evidence unlocked for 5 minutes. Access logged.");
      } else {
        const outcome = dialog === "review-reject" ? "REJECTED" : "CONFIRMED";
        if (state.mode === "desktop") {
          state.desktopReviewStatus = outcome;
          render();
          showToast(`Candidate ${outcome.toLowerCase()} and added to the audit chain.`);
        } else {
          state.reviewStatus = outcome;
          setRoute("mobile", "receipt");
          showToast(`Candidate ${outcome.toLowerCase()} and audited.`);
        }
      }
    }
    window.WhiteRabbitMobile?.handle?.(action, target, state, { render, setRoute, showToast, announce });
    window.WhiteRabbitDesktop?.handle?.(action, target, state, { render, setRoute, showToast, announce });
  }

  window.addEventListener("hashchange", () => {
    parseRoute();
    render();
  });
  window.addEventListener("popstate", () => {
    parseRoute();
    render();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (state.dialog) state.dialog = null;
      if (state.commandOpen) state.commandOpen = false;
      render();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && state.mode === "desktop") {
      event.preventDefault();
      window.WhiteRabbitDesktop.openCommand?.(state, render);
    }
  });
  document.addEventListener("click", handleClick);

  window.WhiteRabbit = { state, icon, announce, setRoute, render, showToast, renderDialog };
  window.addEventListener("DOMContentLoaded", () => {
    parseRoute();
    render();
  }, { once: true });
})();
