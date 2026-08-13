import type { Metadata } from "next";
import Link from "next/link";

import { readRuntimeSupabasePublicConfig } from "../../../lib/supabase/config";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

const pendingSettings = [
  {
    title: "Organization and deployment",
    description:
      "Controller, purpose, deployment and membership require tenant-scoped storage.",
    items: [
      ["Organization", "Not created"],
      ["Controller profile", "Not selected"],
      ["Active deployment", "Not created"],
      ["Membership", "Not assigned"],
    ],
  },
  {
    title: "Capabilities and policy",
    description:
      "A capability is unavailable until an effective, persisted policy allows it.",
    items: [
      ["ALPR", "No effective policy"],
      ["Object detection", "No effective policy"],
      ["Biometric identification", "Separately gated"],
      ["Public projection", "Disabled"],
    ],
  },
  {
    title: "Data and retention",
    description:
      "No operational store or retention schedule exists in this deployment.",
    items: [
      ["Operational database", "Not provisioned"],
      ["Evidence storage", "Not provisioned"],
      ["Retention policy", "Not approved"],
      ["Audit export", "Unavailable"],
    ],
  },
] as const;

export default function SettingsPage() {
  const backend = readRuntimeSupabasePublicConfig();
  const authConfigured = backend.status === "CONFIGURED";

  return (
    <>
      <header className="workspace-heading settings-heading">
        <div>
          <span className="kicker">Workspace controls</span>
          <h1>Settings</h1>
          <p>
            Configuration shown here is derived from the running deployment.
          </p>
        </div>
        <Link className="button button-primary" href="/app/setup">
          Review setup <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className="settings-summary" aria-label="Account readiness">
        <div>
          <span className="mono-label">ACCOUNT &amp; ACCESS</span>
          <h2>
            {authConfigured ? "Auth is configured" : "Auth is not connected"}
          </h2>
          <p>
            Email and password use Supabase Auth. Privileged actions will remain
            blocked until a verified session, role and required MFA level exist.
          </p>
        </div>
        <dl>
          <div>
            <dt>Provider</dt>
            <dd className={authConfigured ? "settings-ready" : ""}>
              {authConfigured ? "Supabase configured" : "Not connected"}
            </dd>
          </div>
          <div>
            <dt>Login method</dt>
            <dd>Email + password</dd>
          </div>
          <div>
            <dt>SSO</dt>
            <dd>Deferred</dd>
          </div>
          <div>
            <dt>Privileged MFA</dt>
            <dd>Required; not evaluated here</dd>
          </div>
        </dl>
        <div className="settings-actions">
          <Link className="button button-secondary" href="/account/sign-in">
            Sign in
          </Link>
          <Link className="text-link" href="/account/recovery">
            Recover account
          </Link>
        </div>
      </section>

      <div className="settings-grid">
        {pendingSettings.map((section) => (
          <section className="settings-panel" key={section.title}>
            <div>
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </div>
            <dl>
              {section.items.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <section className="settings-device-note">
        <div>
          <span className="mono-label">THIS DEVICE</span>
          <h2>Browser field mode stays local and foreground-only.</h2>
          <p>
            Installation does not enroll a node. A revocable device identity,
            approved capture zone and effective policy still require persisted
            setup.
          </p>
        </div>
        <Link className="button button-secondary" href="/sentry">
          Open Sentry
        </Link>
      </section>
    </>
  );
}
