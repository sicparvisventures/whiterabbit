import type { ReactNode } from "react";
import Link from "next/link";

import { AccountMenu } from "../../components/account-menu";
import { ProductNavigation } from "../../components/product-navigation";
import { deriveSessionIdentity } from "../../lib/auth/session-identity";
import { createSupabaseServerClient } from "../../lib/supabase/server";

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  const server = await createSupabaseServerClient();
  let identity = deriveSessionIdentity(null);

  if (server.status === "READY") {
    try {
      const { data } = await server.client.auth.getClaims();
      identity = deriveSessionIdentity(data?.claims);
    } catch {
      identity = deriveSessionIdentity(null);
    }
  }

  return (
    <main className="product-shell">
      <aside className="product-sidebar">
        <Link
          className="wordmark"
          href="/app"
          aria-label="WhiteRabbit workspace"
        >
          <span className="wordmark-symbol" aria-hidden="true">
            W
          </span>
          <span>WhiteRabbit</span>
        </Link>
        <ProductNavigation variant="desktop" />
        <div className="sidebar-connection">
          <span className="mono-label">DATA PLANE</span>
          <strong>Not provisioned</strong>
          <p>No operational records are available.</p>
        </div>
      </aside>

      <section className="product-workspace">
        <header className="product-topbar">
          <Link className="mobile-wordmark wordmark" href="/app">
            <span className="wordmark-symbol" aria-hidden="true">
              W
            </span>
            <span>WhiteRabbit</span>
          </Link>
          <div className="workspace-scope">
            <span className="mono-label">WORKSPACE</span>
            <strong>Setup required</strong>
          </div>
          <div className="topbar-state">
            <span className="connection-pill">
              <i /> No deployment
            </span>
            <AccountMenu identity={identity} />
          </div>
        </header>
        <div className="product-content">{children}</div>
      </section>

      <ProductNavigation variant="mobile" />
    </main>
  );
}
