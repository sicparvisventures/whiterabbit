# Supabase Project Handoff

- Status: ready for owner action
- Date: 2026-08-13
- Scope: Auth and synthetic/non-sensitive control-plane setup only
- Production URL: `https://whiterabbit-theta.vercel.app`

This runbook is the boundary between the completed backend-independent PWA and the
first hosted Supabase project. Creating a project does not authorize operational,
police-investigation, military-operational, intelligence, classified or biometric
data in the public Vercel/Supabase topology.

## 1. Owner creates the project

Create a Supabase project in an organizational account and an approved region. Enable
email/password authentication and require email confirmation. Do not add real
identities, footage, plates, faces, watchlists, camera coordinates or operational
events during setup.

Return these non-secret values through the project configuration channel:

1. project URL for `NEXT_PUBLIC_SUPABASE_URL`;
2. publishable key for `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`;
3. project reference used by the Supabase CLI;
4. confirmation that email/password and email confirmation are enabled;
5. confirmation that the URL and email-template settings below are applied.

Do not send a service-role key, database password, personal access token, SMTP
credential or any other secret through chat, Git, an issue or a public CI log. An
authorized operator should authenticate the CLI locally or place secrets directly in
the approved secret manager.

## 2. Auth URL configuration

Set the Auth Site URL to:

```text
https://whiterabbit-theta.vercel.app
```

Allow only the environments required for testing:

```text
https://whiterabbit-theta.vercel.app
https://*-reserve4you.vercel.app/**
http://localhost:3000/**
http://127.0.0.1:3000/**
```

The first entry is the stable production alias. The second is the current Vercel team
preview pattern and must be removed or narrowed if previews will receive protected
configuration. The local entries are development-only. Do not add a global `https://**`
pattern.

Supabase documents exact production URLs and scoped wildcard patterns for Vercel
previews in its [redirect URL guide](https://supabase.com/docs/guides/auth/redirect-urls).

## 3. Auth email templates

WhiteRabbit verifies token hashes in the server-side `/auth/confirm` route before
creating the cookie-backed session. Update the link in **Confirm signup** to:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">
  Confirm email address
</a>
```

Update the link in **Reset password** to:

```html
<a href="{{ .RedirectTo }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">
  Reset password
</a>
```

Signup and recovery now pass only a validated HTTPS origin (localhost HTTP is accepted
for development), so `RedirectTo` composes with the same callback route in production
and previews. After recovery verification, WhiteRabbit redirects locally to
`/account/update-password`; signup redirects to `/app/setup`.

Supabase documents `TokenHash`, `RedirectTo`, server-side `verifyOtp`, email prefetch
risks and tracking-link rewriting in its
[email template guide](https://supabase.com/docs/guides/auth/auth-email-templates).
Disable link tracking for Auth emails. Evaluate OTP or a confirmation interstitial
before institutional use where enterprise mail protection prefetches links.

## 4. Vercel public environment values

Add only these values to the Vercel project after the Auth configuration is complete:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

They are browser-visible identifiers and are not authorization controls. Row Level
Security is mandatory before any application table is exposed. Do not create a
`NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY` or equivalent variable.

Production receives the project values first. Preview environments receive them only
when their access and data classification are explicitly approved. Trigger a clean
deployment after changing the variables and verify signup, confirmation, signin,
recovery, password update, signout and unauthenticated `/app` redirect.

## 5. WhiteRabbit migration sequence

Once the owner confirms the handoff, WhiteRabbit will implement and review these as
versioned migrations rather than dashboard-only schema edits:

1. controller profiles, organizations, memberships, deployments and spaces;
2. capability/purpose/policy references and fail-closed lifecycle states;
3. nodes and short-lived, single-use node enrollment records, with claim digests only;
4. append-only audit records and mutation metadata;
5. RLS on every application table, default-deny grants and tenant membership helpers;
6. private storage buckets and policies only if the first approved slice requires them;
7. generated TypeScript database types and provider repositories;
8. cross-tenant, missing-membership, wrong-role, wrong-profile and revoked-node tests;
9. binding the existing setup/settings/node ports to the reviewed repositories.

No inference model, signed event ingest, evidence upload, map provider, retention value,
watchlist or biometric table is included in this handoff. Each requires its own
approved slice and review gate.

## 6. Handoff acceptance

The handoff is ready for migrations only when:

- the five requested non-secret confirmations are recorded;
- CLI authentication is available without sharing a token in chat;
- production and preview data classifications are approved;
- Auth templates have been tested with non-operational accounts;
- no service-role credential is present in the repository or public environment;
- the owner explicitly authorizes the first migration batch.
