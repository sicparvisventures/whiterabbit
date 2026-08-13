import { describe, expect, it } from "vitest";

import { decideSessionAccess } from "./session-policy";

describe("decideSessionAccess", () => {
  it("keeps the product inspectable before a backend exists", () => {
    expect(decideSessionAccess("NOT_CONFIGURED", false)).toEqual({
      outcome: "UNCONFIGURED_PREVIEW",
    });
  });

  it("denies invalid deployment configuration", () => {
    expect(decideSessionAccess("INVALID", false)).toEqual({
      outcome: "DENIED",
      reason: "INVALID_BACKEND_CONFIGURATION",
    });
  });

  it("requires verified claims when Supabase is configured", () => {
    expect(decideSessionAccess("CONFIGURED", false)).toEqual({
      outcome: "DENIED",
      reason: "AUTHENTICATION_REQUIRED",
    });
  });

  it("permits only configured sessions with verified claims", () => {
    expect(decideSessionAccess("CONFIGURED", true)).toEqual({
      outcome: "PERMITTED",
    });
  });
});
