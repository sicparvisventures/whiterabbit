import type { Metadata } from "next";

import { SetupForm } from "../../../components/setup-form";

export const metadata: Metadata = {
  title: "Setup",
  robots: { index: false, follow: false },
};

export default function SetupPage() {
  return (
    <>
      <header className="workspace-heading setup-page-heading">
        <div>
          <span className="kicker">First deployment</span>
          <h1>Configure the accountable boundary.</h1>
          <p>
            This form matches the future storage contract but cannot persist
            until the Supabase schema and row-level policies are applied.
          </p>
        </div>
        <span className="connection-pill">
          <i /> Storage required
        </span>
      </header>
      <SetupForm />
    </>
  );
}
