import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { parseConfirmationRequest } from "../../../lib/auth/confirmation";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

function accountErrorRedirect(request: NextRequest, reason: string) {
  const url = request.nextUrl.clone();
  url.pathname = "/account/sign-in";
  url.search = "";
  url.searchParams.set("reason", reason);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const confirmation = parseConfirmationRequest(request.nextUrl);
  if (confirmation.status === "INVALID") {
    return accountErrorRedirect(request, "confirmation_invalid");
  }

  const server = await createSupabaseServerClient();
  if (server.status !== "READY") {
    return accountErrorRedirect(request, "backend_not_configured");
  }

  const { error } = await server.client.auth.verifyOtp({
    token_hash: confirmation.tokenHash,
    type: confirmation.type as EmailOtpType,
  });

  if (error) return accountErrorRedirect(request, "confirmation_rejected");
  return NextResponse.redirect(new URL(confirmation.nextPath, request.url));
}
