import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { readRuntimeSupabasePublicConfig } from "./config";

export type SupabaseServerClientResult =
  | { status: "NOT_CONFIGURED" }
  | { status: "INVALID_CONFIGURATION" }
  | { status: "READY"; client: SupabaseClient };

export async function createSupabaseServerClient(): Promise<SupabaseServerClientResult> {
  const config = readRuntimeSupabasePublicConfig();
  if (config.status === "NOT_CONFIGURED") return { status: "NOT_CONFIGURED" };
  if (config.status === "INVALID") return { status: "INVALID_CONFIGURATION" };

  const cookieStore = await cookies();
  const client = createServerClient(config.url, config.publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. proxy.ts refreshes them instead.
        }
      },
    },
  });

  return { status: "READY", client };
}
