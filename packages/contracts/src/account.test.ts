import { describe, expect, it } from "vitest";

import {
  accountMutationResultSchema,
  createAccountInputSchema,
  signInInputSchema,
} from "./account";

describe("createAccountInputSchema", () => {
  it("normalizes a valid email and accepts a strong matching password", () => {
    const result = createAccountInputSchema.parse({
      email: "  Operator@Example.BE ",
      password: "correct horse battery staple",
      passwordConfirmation: "correct horse battery staple",
      acceptsTerms: true,
    });

    expect(result.email).toBe("operator@example.be");
  });

  it("rejects a password confirmation mismatch", () => {
    const result = createAccountInputSchema.safeParse({
      email: "operator@example.be",
      password: "correct horse battery staple",
      passwordConfirmation: "different secure phrase",
      acceptsTerms: true,
    });

    expect(result.success).toBe(false);
  });

  it("requires explicit terms acceptance", () => {
    const result = createAccountInputSchema.safeParse({
      email: "operator@example.be",
      password: "correct horse battery staple",
      passwordConfirmation: "correct horse battery staple",
      acceptsTerms: false,
    });

    expect(result.success).toBe(false);
  });
});

describe("signInInputSchema", () => {
  it("rejects an empty password", () => {
    expect(
      signInInputSchema.safeParse({
        email: "operator@example.be",
        password: "",
      }).success,
    ).toBe(false);
  });
});

describe("accountMutationResultSchema", () => {
  it("represents missing backend configuration without a fake user", () => {
    const result = accountMutationResultSchema.parse({
      status: "BACKEND_NOT_CONFIGURED",
    });

    expect(result).toEqual({ status: "BACKEND_NOT_CONFIGURED" });
    expect(result).not.toHaveProperty("userId");
  });
});
