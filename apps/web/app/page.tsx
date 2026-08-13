import Link from "next/link";

import { SiteHeader } from "../components/site-header";
import { readRuntimeSupabasePublicConfig } from "../lib/supabase/config";

const capabilityCards = [
  {
    number: "01",
    title: "Vehicle intelligence",
    body: "Local plate recognition and object context, designed around signed candidates and human review.",
    label: "Model approval required",
  },
  {
    number: "02",
    title: "Edge object detection",
    body: "Detect vehicles, hazards and operational objects without sending a continuous camera stream to the cloud.",
    label: "Runtime not installed",
  },
  {
    number: "03",
    title: "Governed watchlists",
    body: "An isolated biometric capability boundary for specifically authorized, tenant-scoped deployments.",
    label: "Legally and technically gated",
  },
] as const;

export default function LandingPage() {
  const backend = readRuntimeSupabasePublicConfig();
  const backendReady = backend.status === "CONFIGURED";

  return (
    <main className="marketing-shell">
      <SiteHeader />

      <section className="hero page-width">
        <div className="hero-copy">
          <span className="kicker">Edge-first situational awareness</span>
          <h1>
            Turn the cameras you already own into accountable sensing nodes.
          </h1>
          <p>
            WhiteRabbit is an open platform for public-sector teams to connect
            phones, laptops and fixed cameras—without treating surveillance as
            an unlimited data collection exercise.
          </p>
          <div className="button-row">
            <Link className="button button-primary" href="/account/create">
              Create account
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="button button-secondary" href="/sentry">
              Test this camera
            </Link>
          </div>
          <ul className="trust-list" aria-label="Platform principles">
            <li>Foreground camera</li>
            <li>Raw stream stays local</li>
            <li>Human-reviewed outcomes</li>
          </ul>
        </div>

        <div className="readiness-card" aria-label="Current platform readiness">
          <div className="readiness-topline">
            <span className="mono-label">SYSTEM / READINESS</span>
            <span className="signal" aria-label="Web application available">
              <i /> Web ready
            </span>
          </div>
          <div className="readiness-orbit" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <span className="orbit-core">WR</span>
          </div>
          <dl className="readiness-list">
            <div>
              <dt>Authentication</dt>
              <dd className={backendReady ? "status-positive" : "status-muted"}>
                {backendReady ? "Connected" : "Not connected"}
              </dd>
            </div>
            <div>
              <dt>Camera</dt>
              <dd className="status-muted">Permission not requested</dd>
            </div>
            <div>
              <dt>Detection</dt>
              <dd className="status-muted">No approved runtime</dd>
            </div>
            <div>
              <dt>Operational data</dt>
              <dd className="status-muted">No data store</dd>
            </div>
          </dl>
          <p className="readiness-footnote">
            Status is derived from this deployment. No sample records are shown.
          </p>
        </div>
      </section>

      <section className="principle-band" aria-label="Architecture summary">
        <div className="page-width principle-grid">
          <span className="mono-label">ONE CONTROL PLANE</span>
          <p>One installable web app. Mobile in the field, dense on desktop.</p>
          <p>Each authority remains a separate controller and data boundary.</p>
        </div>
      </section>

      <section className="section page-width" id="platform">
        <div className="section-heading">
          <span className="kicker">Platform capabilities</span>
          <h2>Useful now. Powerful only when authorized.</h2>
          <p>
            The interface exposes readiness honestly. A feature flag can never
            substitute for policy, model provenance or controller approval.
          </p>
        </div>
        <div className="capability-grid">
          {capabilityCards.map((capability) => (
            <article className="capability-card" key={capability.number}>
              <span className="capability-number">{capability.number}</span>
              <h3>{capability.title}</h3>
              <p>{capability.body}</p>
              <span className="capability-status">{capability.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section
        className="section page-width architecture-section"
        id="architecture"
      >
        <div className="section-heading">
          <span className="kicker">Designed for separation</span>
          <h2>From a local frame to a governed decision.</h2>
        </div>
        <ol className="architecture-flow">
          <li>
            <span>01</span>
            <strong>Observe locally</strong>
            <p>A visible foreground camera session remains on the device.</p>
          </li>
          <li>
            <span>02</span>
            <strong>Minimize at the edge</strong>
            <p>Approved inference may produce a minimal, signed candidate.</p>
          </li>
          <li>
            <span>03</span>
            <strong>Review with context</strong>
            <p>An authorized person reviews evidence and effective policy.</p>
          </li>
          <li>
            <span>04</span>
            <strong>Act within scope</strong>
            <p>Every outcome remains tenant-, purpose- and retention-bound.</p>
          </li>
        </ol>
      </section>

      <section className="cta-section">
        <div className="page-width cta-inner">
          <div>
            <span className="kicker kicker-light">Start with one device</span>
            <h2>Build the smallest accountable mesh.</h2>
          </div>
          <Link className="button button-light" href="/account/create">
            Create your workspace
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <footer className="site-footer page-width">
        <span>WhiteRabbit</span>
        <p>Open-source, accountable sensing infrastructure.</p>
        <a href="https://github.com/sicparvisventures/whiterabbit">GitHub</a>
      </footer>
    </main>
  );
}
