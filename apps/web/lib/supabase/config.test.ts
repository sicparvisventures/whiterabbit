import { describe, expect, it } from "vitest";

import { readSupabasePublicConfig } from "./config";

describe("readSupabasePublicConfig", () => {
  it("returns an explicit unconfigured state when both values are absent", () => {
    expect(readSupabasePublicConfig({})).toEqual({
      status: "NOT_CONFIGURED",
    });
  });

  it("rejects a partial configuration", () => {
    expect(
      readSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toEqual({ status: "INVALID", reason: "INCOMPLETE_CONFIGURATION" });
  });

  it("rejects a non-HTTPS project URL", () => {
    expect(
      readSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "http://project.supabase.co",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_test_value_not_a_secret",
      }),
    ).toEqual({ status: "INVALID", reason: "INVALID_PROJECT_URL" });
  });

  it("returns validated public browser configuration", () => {
    expect(
      readSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co/",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
          "sb_publishable_test_value_not_a_secret",
      }),
    ).toEqual({
      status: "CONFIGURED",
      url: "https://project.supabase.co",
      publishableKey: "sb_publishable_test_value_not_a_secret",
    });
  });
});
