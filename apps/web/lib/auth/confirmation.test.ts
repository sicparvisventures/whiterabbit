import { describe, expect, it } from "vitest";

import { parseConfirmationRequest } from "./confirmation";

describe("parseConfirmationRequest", () => {
  it("accepts a supported token flow and local next path", () => {
    expect(
      parseConfirmationRequest(
        new URL(
          "https://app.example.be/auth/confirm?token_hash=hashed-token&type=email&next=/app/setup",
        ),
      ),
    ).toEqual({
      status: "VALID",
      tokenHash: "hashed-token",
      type: "email",
      nextPath: "/app/setup",
    });
  });

  it("routes recovery to the password update page by default", () => {
    expect(
      parseConfirmationRequest(
        new URL(
          "https://app.example.be/auth/confirm?token_hash=hashed-token&type=recovery",
        ),
      ),
    ).toMatchObject({
      status: "VALID",
      nextPath: "/account/update-password",
    });
  });

  it("rejects cross-origin next destinations", () => {
    expect(
      parseConfirmationRequest(
        new URL(
          "https://app.example.be/auth/confirm?token_hash=hashed-token&type=email&next=https://attacker.example",
        ),
      ),
    ).toEqual({ status: "INVALID" });
  });

  it("rejects missing tokens and unsupported types", () => {
    expect(
      parseConfirmationRequest(
        new URL("https://app.example.be/auth/confirm?type=unknown"),
      ),
    ).toEqual({ status: "INVALID" });
  });
});
