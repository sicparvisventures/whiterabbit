import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import {
  readRuntimeSupabasePublicConfig,
  type SupabasePublicConfig,
} from "./config";

export type SupabaseBrowserClientResult =
  | { status: "NOT_CONFIGURED" }
  | {
      status: "INVALID_CONFIGURATION";
      reason: Extract<SupabasePublicConfig, { status: "INVALID" }>["reason"];
    }
  | { status: "READY"; client: SupabaseClient };

export function createSupabaseBrowserClient(
  config: SupabasePublicConfig = readRuntimeSupabasePublicConfig(),
): SupabaseBrowserClientResult {
  if (config.status === "NOT_CONFIGURED") {
    return { status: "NOT_CONFIGURED" };
  }

  if (config.status === "INVALID") {
    return { status: "INVALID_CONFIGURATION", reason: config.reason };
  }

  return {
    status: "READY",
    client: createBrowserClient(config.url, config.publishableKey),
  };
}
