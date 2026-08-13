import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { decideSessionAccess } from "../auth/session-policy";
import { readRuntimeSupabasePublicConfig } from "./config";

function redirectToSignIn(request: NextRequest, reason: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/account/sign-in";
  url.search = "";
  url.searchParams.set("reason", reason);
  url.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export async function updateSupabaseSession(request: NextRequest) {
  const config = readRuntimeSupabasePublicConfig();
  const initialDecision = decideSessionAccess(config.status, false);

  if (initialDecision.outcome === "UNCONFIGURED_PREVIEW") {
    return NextResponse.next({ request });
  }

  if (config.status !== "CONFIGURED") {
    return redirectToSignIn(request, "backend_configuration_invalid");
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [key, value] of Object.entries(headers)) {
          response.headers.set(key, value);
        }
      },
    },
  });

  let hasVerifiedClaims = false;
  try {
    const { data } = await supabase.auth.getClaims();
    hasVerifiedClaims = Boolean(data?.claims);
  } catch {
    return redirectToSignIn(request, "session_unavailable");
  }

  const decision = decideSessionAccess(config.status, hasVerifiedClaims);
  if (decision.outcome !== "PERMITTED") {
    return redirectToSignIn(request, "authentication_required");
  }

  return response;
}
