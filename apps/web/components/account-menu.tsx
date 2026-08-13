import Link from "next/link";

import type { SessionIdentity } from "../lib/auth/session-identity";
import { signOutAction } from "../app/actions/auth";

export function AccountMenu({ identity }: { identity: SessionIdentity }) {
  if (identity.status !== "AUTHENTICATED") {
    return (
      <Link
        className="account-button"
        href="/account/sign-in"
        aria-label="Sign in"
      >
        AC
      </Link>
    );
  }

  return (
    <details className="account-menu">
      <summary className="account-button" aria-label="Open account menu">
        {identity.initials}
      </summary>
      <div className="account-popover">
        <span className="mono-label">SIGNED IN</span>
        <strong>{identity.email}</strong>
        <p>Human operator account</p>
        <form action={signOutAction}>
          <button type="submit">Sign out</button>
        </form>
      </div>
    </details>
  );
}
