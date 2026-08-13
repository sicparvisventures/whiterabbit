import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  AccountForm,
  type AccountMode,
} from "../../../components/account-form";

const modes = new Set<AccountMode>(["create", "sign-in", "recovery"]);

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return [...modes].map((mode) => ({ mode }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ mode: string }>;
}) {
  const { mode } = await params;
  if (!modes.has(mode as AccountMode)) notFound();

  return (
    <main className="account-page">
      <header className="account-header">
        <Link className="wordmark" href="/" aria-label="WhiteRabbit home">
          <span className="wordmark-symbol" aria-hidden="true">
            W
          </span>
          <span>WhiteRabbit</span>
        </Link>
        <span>Accountable sensing infrastructure</span>
      </header>
      <section className="account-layout">
        <div className="account-context">
          <span className="mono-label">CONTROL / START</span>
          <h2>Your camera is not your credential.</h2>
          <p>
            Human accounts use Supabase Auth. Camera nodes receive separate,
            revocable identities only after an authorized deployment exists.
          </p>
          <ul>
            <li>No password is stored by WhiteRabbit.</li>
            <li>No operational record is created before setup.</li>
            <li>Biometric capability remains disabled by default.</li>
          </ul>
        </div>
        <AccountForm mode={mode as AccountMode} />
      </section>
    </main>
  );
}
