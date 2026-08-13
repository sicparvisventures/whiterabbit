import { describe, expect, it } from "vitest";

import { deriveSessionIdentity } from "./session-identity";

describe("deriveSessionIdentity", () => {
  it("rejects missing or malformed claims", () => {
    expect(deriveSessionIdentity(null)).toEqual({ status: "UNAUTHENTICATED" });
    expect(deriveSessionIdentity({ email: "operator@example.be" })).toEqual({
      status: "UNAUTHENTICATED",
    });
  });

  it("derives a minimal display identity from verified claims", () => {
    expect(
      deriveSessionIdentity({
        sub: "2f42fa2e-25f2-42a3-8f36-aab184a56c15",
        email: "operator@example.be",
      }),
    ).toEqual({
      status: "AUTHENTICATED",
      userId: "2f42fa2e-25f2-42a3-8f36-aab184a56c15",
      email: "operator@example.be",
      initials: "OP",
    });
  });

  it("does not put the email domain in initials", () => {
    expect(
      deriveSessionIdentity({
        sub: "2f42fa2e-25f2-42a3-8f36-aab184a56c15",
        email: "a@example.be",
      }),
    ).toMatchObject({ initials: "A" });
  });
});
