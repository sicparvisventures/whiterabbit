import { describe, expect, it } from "vitest";

import { createSupabaseBrowserClient } from "./browser";

describe("createSupabaseBrowserClient", () => {
  it("does not construct a client when configuration is absent", () => {
    expect(createSupabaseBrowserClient({ status: "NOT_CONFIGURED" })).toEqual({
      status: "NOT_CONFIGURED",
    });
  });

  it("preserves an invalid configuration as a denied state", () => {
    expect(
      createSupabaseBrowserClient({
        status: "INVALID",
        reason: "INCOMPLETE_CONFIGURATION",
      }),
    ).toEqual({
      status: "INVALID_CONFIGURATION",
      reason: "INCOMPLETE_CONFIGURATION",
    });
  });

  it("constructs the real client only for validated public configuration", () => {
    const result = createSupabaseBrowserClient({
      status: "CONFIGURED",
      url: "https://project.supabase.co",
      publishableKey: "sb_publishable_test_value_not_a_secret",
    });

    expect(result.status).toBe("READY");
    if (result.status === "READY") {
      expect(result.client.auth).toBeDefined();
    }
  });
});
