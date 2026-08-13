import type { SupabasePublicConfig } from "../supabase/config";

export type SessionAccessDecision =
  | { outcome: "UNCONFIGURED_PREVIEW" }
  | { outcome: "PERMITTED" }
  | {
      outcome: "DENIED";
      reason: "INVALID_BACKEND_CONFIGURATION" | "AUTHENTICATION_REQUIRED";
    };

export function decideSessionAccess(
  configuration: SupabasePublicConfig["status"],
  hasVerifiedClaims: boolean,
): SessionAccessDecision {
  if (configuration === "NOT_CONFIGURED") {
    return { outcome: "UNCONFIGURED_PREVIEW" };
  }

  if (configuration === "INVALID") {
    return { outcome: "DENIED", reason: "INVALID_BACKEND_CONFIGURATION" };
  }

  if (!hasVerifiedClaims) {
    return { outcome: "DENIED", reason: "AUTHENTICATION_REQUIRED" };
  }

  return { outcome: "PERMITTED" };
}
