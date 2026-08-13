import Link from "next/link";

import { readRuntimeSupabasePublicConfig } from "../../lib/supabase/config";

export default function OverviewPage() {
  const backend = readRuntimeSupabasePublicConfig();
  const authConfigured = backend.status === "CONFIGURED";

  return (
    <>
      <header className="workspace-heading">
        <div>
          <span className="kicker">Command center</span>
          <h1>Overview</h1>
          <p>
            Your workspace will reflect only persisted, tenant-scoped records.
          </p>
        </div>
        <Link className="button button-primary" href="/app/setup">
          Begin setup <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className="configuration-banner" role="status">
        <span className="configuration-mark" aria-hidden="true">
          !
        </span>
        <div>
          <strong>Workspace setup is incomplete</strong>
          <p>
            Connect storage, authenticate and create an authorized deployment
            before nodes or operational data can appear.
          </p>
        </div>
      </section>

      <section className="readiness-grid" aria-label="Workspace readiness">
        <article>
          <span>Auth provider</span>
          <strong>{authConfigured ? "Configured" : "Not connected"}</strong>
          <small>
            {authConfigured
              ? "Sign in to verify access"
              : "Supabase values required"}
          </small>
        </article>
        <article>
          <span>Data store</span>
          <strong>Not provisioned</strong>
          <small>Migrations have not been applied</small>
        </article>
        <article>
          <span>Deployment</span>
          <strong>Not created</strong>
          <small>No controller or purpose is active</small>
        </article>
        <article>
          <span>Inference</span>
          <strong>Unavailable</strong>
          <small>No model runtime is approved</small>
        </article>
      </section>

      <div className="overview-grid">
        <section className="product-panel setup-path">
          <div className="panel-heading">
            <div>
              <span className="mono-label">GET STARTED</span>
              <h2>Deployment path</h2>
            </div>
            <span className="panel-tag">0 / 4 ready</span>
          </div>
          <ol className="setup-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Connect Supabase</strong>
                <p>Provide Auth and RLS-backed storage.</p>
              </div>
              <em>Pending</em>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Create the organization</strong>
                <p>Name the accountable controller.</p>
              </div>
              <em>Blocked</em>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Approve a deployment</strong>
                <p>Bind purpose, profile and capabilities.</p>
              </div>
              <em>Blocked</em>
            </li>
            <li>
              <span>04</span>
              <div>
                <strong>Enroll a camera node</strong>
                <p>Create a separate revocable device identity.</p>
              </div>
              <em>Blocked</em>
            </li>
          </ol>
        </section>

        <section className="product-panel data-empty">
          <span className="empty-glyph" aria-hidden="true">
            ◎
          </span>
          <span className="mono-label">OPERATIONAL PICTURE</span>
          <h2>No operational data</h2>
          <p>
            WhiteRabbit does not generate example events, node health or
            locations in production. Real, authorized records will appear here
            after setup.
          </p>
          <Link className="button button-secondary" href="/app/operations">
            Open operations
          </Link>
        </section>
      </div>
    </>
  );
}
