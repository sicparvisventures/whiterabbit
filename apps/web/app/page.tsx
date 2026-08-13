"use client";

import { useState } from "react";

const destinations = [
  "Overview",
  "Operations",
  "Candidates",
  "Watchlists",
  "Nodes",
  "Policies",
  "Audit",
] as const;
type Destination = (typeof destinations)[number];

const events = [
  {
    id: "EVT-1042",
    kind: "ALPR candidate",
    node: "SYN-NODE-03",
    age: "18 sec",
    state: "Review",
  },
  {
    id: "EVT-1041",
    kind: "Object candidate",
    node: "SYN-NODE-07",
    age: "1 min",
    state: "Queued",
  },
  {
    id: "EVT-1040",
    kind: "Biometric candidate",
    node: "SYN-NODE-02",
    age: "4 min",
    state: "Restricted",
  },
] as const;

export default function CommandCenter() {
  const [destination, setDestination] = useState<Destination>("Overview");
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[number]>(
    events[0],
  );
  const [receipt, setReceipt] = useState<string | null>(null);

  function review(outcome: "Confirmed" | "Rejected" | "Inconclusive") {
    setReceipt(
      `${selectedEvent.id}: ${outcome} recorded locally in this synthetic UI session.`,
    );
  }

  return (
    <main className="shell">
      <aside className="sidebar" aria-label="Primary navigation">
        <a className="brand" href="#workspace" aria-label="WhiteRabbit home">
          <span className="brand-mark" aria-hidden="true">
            W
          </span>
          <span>
            <strong>WhiteRabbit</strong>
            <small>Command center</small>
          </span>
        </a>

        <nav>
          {destinations.map((item) => (
            <button
              className={destination === item ? "nav-item active" : "nav-item"}
              key={item}
              onClick={() => setDestination(item)}
              type="button"
            >
              <span className="nav-glyph" aria-hidden="true">
                {item.slice(0, 2).toUpperCase()}
              </span>
              {item}
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <span className="eyebrow">Environment</span>
          <strong>SYNTH-01</strong>
          <span>Generated data only</span>
        </div>
      </aside>

      <section className="workspace" id="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              BE-DEFENCE-ADMIN · RESTRICTED · SYNTHETIC
            </span>
            <h1>{destination}</h1>
          </div>
          <div className="topbar-actions">
            <span className="status healthy">
              <i /> Foundation healthy
            </span>
            <button
              className="avatar"
              type="button"
              aria-label="Open account menu"
            >
              SV
            </button>
          </div>
        </header>

        <div className="notice" role="status">
          <strong>Implementation foundation</strong>
          <span>
            Cloud, camera, authentication and inference are not connected yet.
          </span>
        </div>

        <section className="metrics" aria-label="Synthetic deployment summary">
          <article>
            <span>Node readiness</span>
            <strong>7 / 8</strong>
            <small className="good">Within synthetic target</small>
          </article>
          <article>
            <span>Review queue</span>
            <strong>03</strong>
            <small>Oldest candidate · 4 min</small>
          </article>
          <article>
            <span>Policy package</span>
            <strong>v0.3</strong>
            <small>Generated fixture · current</small>
          </article>
          <article>
            <span>Evidence expiry</span>
            <strong>24 h</strong>
            <small>No persistent source media</small>
          </article>
        </section>

        <section className="operations-grid">
          <article className="panel events-panel">
            <header className="panel-header">
              <div>
                <span className="eyebrow">Synthetic queue</span>
                <h2>Recent candidates</h2>
              </div>
              <button
                className="quiet-button"
                type="button"
                onClick={() =>
                  setReceipt(
                    "Queue refreshed locally. No network request was made.",
                  )
                }
              >
                Refresh
              </button>
            </header>
            <div className="event-list">
              {events.map((event) => (
                <button
                  className={
                    selectedEvent.id === event.id
                      ? "event-row selected"
                      : "event-row"
                  }
                  key={event.id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setReceipt(null);
                  }}
                  type="button"
                >
                  <span className="event-icon" aria-hidden="true">
                    {event.kind.slice(0, 1)}
                  </span>
                  <span>
                    <strong>{event.kind}</strong>
                    <small>
                      {event.id} · {event.node}
                    </small>
                  </span>
                  <span className="event-meta">
                    <strong>{event.age}</strong>
                    <small>{event.state}</small>
                  </span>
                </button>
              ))}
            </div>
          </article>

          <article
            className="panel map-panel"
            aria-label="Fictional site overview"
          >
            <header className="panel-header">
              <div>
                <span className="eyebrow">Fictional site</span>
                <h2>North perimeter</h2>
              </div>
              <span className="status attention">
                <i /> 1 node degraded
              </span>
            </header>
            <div className="site-map">
              <span className="road horizontal" />
              <span className="road vertical" />
              <button
                className="node node-a"
                type="button"
                aria-label="Synthetic node 03, healthy"
              >
                03
              </button>
              <button
                className="node node-b attention-node"
                type="button"
                aria-label="Synthetic node 07, degraded"
              >
                07
              </button>
              <button
                className="node node-c"
                type="button"
                aria-label="Synthetic node 02, healthy"
              >
                02
              </button>
              <span className="map-label">NO REAL COORDINATES</span>
            </div>
          </article>

          <aside
            className="panel inspector"
            aria-label="Selected candidate details"
          >
            <header className="panel-header">
              <div>
                <span className="eyebrow">Selected candidate</span>
                <h2>{selectedEvent.id}</h2>
              </div>
            </header>
            <dl>
              <div>
                <dt>Capability</dt>
                <dd>{selectedEvent.kind}</dd>
              </div>
              <div>
                <dt>Source node</dt>
                <dd>{selectedEvent.node}</dd>
              </div>
              <div>
                <dt>Policy</dt>
                <dd>SYN-POLICY-0.3</dd>
              </div>
              <div>
                <dt>Authority</dt>
                <dd>Generated fixture</dd>
              </div>
              <div>
                <dt>Provenance</dt>
                <dd>Not cryptographically signed</dd>
              </div>
            </dl>
            <p className="candidate-warning">
              A candidate is not an identification and does not authorize
              adverse action.
            </p>
            <div
              className="review-actions"
              aria-label="Synthetic review outcome"
            >
              <button
                className="primary-button"
                type="button"
                onClick={() => review("Confirmed")}
              >
                Confirm candidate
              </button>
              <button
                className="quiet-button"
                type="button"
                onClick={() => review("Rejected")}
              >
                Reject
              </button>
              <button
                className="quiet-button"
                type="button"
                onClick={() => review("Inconclusive")}
              >
                Inconclusive
              </button>
            </div>
          </aside>
        </section>

        {receipt ? (
          <div className="receipt" role="status">
            {receipt}
          </div>
        ) : null}
      </section>
    </main>
  );
}
