"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import type { AccountMutationResult } from "@whiterabbit/contracts/account";

import {
  createAccount,
  requestPasswordReset,
  signIn,
  updatePassword,
} from "../lib/auth/account-service";
import { createSupabaseBrowserClient } from "../lib/supabase/browser";

export type AccountMode = "create" | "sign-in" | "recovery" | "update-password";

const content = {
  create: {
    title: "Create your account",
    description: "Start an accountable workspace for your organization.",
    submit: "Create account",
  },
  "sign-in": {
    title: "Welcome back",
    description: "Sign in to your WhiteRabbit workspace.",
    submit: "Sign in",
  },
  recovery: {
    title: "Reset your password",
    description: "We will send instructions if an account can receive them.",
    submit: "Send reset link",
  },
  "update-password": {
    title: "Choose a new password",
    description:
      "Your verified recovery session authorizes this account change.",
    submit: "Update password",
  },
} as const;

function resultMessage(result: AccountMutationResult): string {
  switch (result.status) {
    case "BACKEND_NOT_CONFIGURED":
      return "Account services are not connected yet. Add the Supabase project variables to activate this form.";
    case "CREATED":
      return result.requiresEmailVerification
        ? "Account created. Check your email to confirm your address."
        : "Account created. Your session is ready.";
    case "SIGNED_IN":
      return "Signed in. Opening your workspace…";
    case "PASSWORD_RESET_REQUESTED":
      return "If the address can receive a reset, instructions are on the way.";
    case "PASSWORD_UPDATED":
      return "Password updated. You can continue to your workspace.";
    case "REJECTED":
      return result.message;
    case "SIGNED_OUT":
      return "Signed out.";
  }
}

export function AccountForm({
  mode,
  notice,
}: {
  mode: AccountMode;
  notice?: string | undefined;
}) {
  const [result, setResult] = useState<AccountMutationResult | null>(null);
  const [pending, setPending] = useState(false);
  const copy = content[mode];

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setResult(null);

    const values = new FormData(event.currentTarget);
    const clientResult = createSupabaseBrowserClient();
    const provider =
      clientResult.status === "READY" ? clientResult.client.auth : null;

    let nextResult: AccountMutationResult;
    if (mode === "create") {
      nextResult = await createAccount(
        provider,
        {
          email: values.get("email"),
          password: values.get("password"),
          passwordConfirmation: values.get("passwordConfirmation"),
          acceptsTerms: values.get("acceptsTerms") === "on",
        },
        window.location.origin,
      );
    } else if (mode === "sign-in") {
      nextResult = await signIn(provider, {
        email: values.get("email"),
        password: values.get("password"),
      });
    } else if (mode === "recovery") {
      nextResult = await requestPasswordReset(
        provider,
        { email: values.get("email") },
        window.location.origin,
      );
    } else {
      nextResult = await updatePassword(provider, {
        password: values.get("password"),
        passwordConfirmation: values.get("passwordConfirmation"),
      });
    }

    setResult(nextResult);
    setPending(false);
    if (nextResult.status === "SIGNED_IN") window.location.assign("/app");
  }

  const usesEmail = mode !== "update-password";
  const usesPassword = mode !== "recovery";
  const confirmsPassword = mode === "create" || mode === "update-password";

  return (
    <div className="account-card">
      <div className="account-card-heading">
        <span className="kicker">Secure access</span>
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>

      <form className="account-form" onSubmit={onSubmit} noValidate>
        {usesEmail && (
          <label>
            <span>Email address</span>
            <input
              autoComplete="email"
              inputMode="email"
              name="email"
              placeholder="you@organization.be"
              required
              type="email"
            />
          </label>
        )}

        {usesPassword && (
          <label>
            <span>Password</span>
            <input
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              minLength={mode === "sign-in" ? 1 : 12}
              name="password"
              required
              type="password"
            />
            {mode !== "sign-in" && <small>At least 12 characters.</small>}
          </label>
        )}

        {confirmsPassword && (
          <label>
            <span>Confirm password</span>
            <input
              autoComplete="new-password"
              minLength={12}
              name="passwordConfirmation"
              required
              type="password"
            />
          </label>
        )}

        {mode === "create" && (
          <label className="check-field">
            <input name="acceptsTerms" required type="checkbox" />
            <span>
              I understand that real-world use requires an authorized
              controller, purpose and deployment policy.
            </span>
          </label>
        )}

        {mode === "sign-in" && (
          <Link className="form-link" href="/account/recovery">
            Forgot password?
          </Link>
        )}

        <button
          className="button button-primary form-submit"
          disabled={pending}
        >
          {pending ? "Working…" : copy.submit}
        </button>
      </form>

      {!result && notice && <p className="form-result error">{notice}</p>}
      {result && (
        <p
          className={
            result.status === "REJECTED" ? "form-result error" : "form-result"
          }
          role="status"
        >
          {resultMessage(result)}
        </p>
      )}

      <div className="account-switch">
        {mode === "create" ? (
          <p>
            Already have an account?{" "}
            <Link href="/account/sign-in">Sign in</Link>
          </p>
        ) : mode === "update-password" ? (
          <p>
            Need another link?{" "}
            <Link href="/account/recovery">Start recovery</Link>
          </p>
        ) : (
          <p>
            New to WhiteRabbit?{" "}
            <Link href="/account/create">Create account</Link>
          </p>
        )}
      </div>
    </div>
  );
}
