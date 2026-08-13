import type { Metadata } from "next";
import Link from "next/link";

import { CameraSentry } from "../../components/camera-sentry";
import { ProductNavigation } from "../../components/product-navigation";
import { readRuntimeSupabasePublicConfig } from "../../lib/supabase/config";

export const metadata: Metadata = {
  title: "Sentry",
  robots: { index: false, follow: false },
};

export default function SentryPage() {
  const backend = readRuntimeSupabasePublicConfig();

  return (
    <main className="sentry-page">
      <header className="sentry-header">
        <Link
          className="wordmark"
          href="/app"
          aria-label="Back to WhiteRabbit workspace"
        >
          <span className="wordmark-symbol" aria-hidden="true">
            W
          </span>
          <span>WhiteRabbit</span>
        </Link>
        <div>
          <span className="mono-label">FIELD MODE</span>
          <strong>Sentry</strong>
        </div>
        <Link className="sentry-close" href="/app" aria-label="Close Sentry">
          ×
        </Link>
      </header>
      <section className="sentry-intro">
        <div>
          <span className="kicker">Foreground camera</span>
          <h1>Use this device as a local Sentry.</h1>
        </div>
        <p>
          Keep this page visible. Locking the screen or switching apps stops
          capture.
        </p>
      </section>
      <CameraSentry backendConfigured={backend.status === "CONFIGURED"} />
      <ProductNavigation variant="mobile" />
    </main>
  );
}
