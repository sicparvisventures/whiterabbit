import { describe, expect, it, vi } from "vitest";

import {
  createAccount,
  requestPasswordReset,
  signIn,
  type AccountAuthProvider,
} from "./account-service";

const userId = "2f42fa2e-25f2-42a3-8f36-aab184a56c15";

function createProvider(): AccountAuthProvider {
  return {
    signUp: vi.fn().mockResolvedValue({
      data: { user: { id: userId }, session: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({
      data: { user: { id: userId } },
      error: null,
    }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
  };
}

describe("createAccount", () => {
  it("fails closed without a provider", async () => {
    expect(
      await createAccount(null, {
        email: "operator@example.be",
        password: "correct horse battery staple",
        passwordConfirmation: "correct horse battery staple",
        acceptsTerms: true,
      }),
    ).toEqual({ status: "BACKEND_NOT_CONFIGURED" });
  });

  it("rejects invalid input before calling the provider", async () => {
    const provider = createProvider();
    const result = await createAccount(provider, {
      email: "invalid",
      password: "short",
      passwordConfirmation: "different",
      acceptsTerms: false,
    });

    expect(result.status).toBe("REJECTED");
    expect(provider.signUp).not.toHaveBeenCalled();
  });

  it("returns the real user and verification state", async () => {
    const provider = createProvider();
    const result = await createAccount(
      provider,
      {
        email: " Operator@Example.BE ",
        password: "correct horse battery staple",
        passwordConfirmation: "correct horse battery staple",
        acceptsTerms: true,
      },
      "https://app.example.be",
    );

    expect(provider.signUp).toHaveBeenCalledWith({
      email: "operator@example.be",
      password: "correct horse battery staple",
      options: { emailRedirectTo: "https://app.example.be" },
    });
    expect(result).toEqual({
      status: "CREATED",
      userId,
      requiresEmailVerification: true,
    });
  });

  it("turns network failures into a stable rejection", async () => {
    const provider = createProvider();
    vi.mocked(provider.signUp).mockRejectedValue(new Error("network detail"));

    await expect(
      createAccount(provider, {
        email: "operator@example.be",
        password: "correct horse battery staple",
        passwordConfirmation: "correct horse battery staple",
        acceptsTerms: true,
      }),
    ).resolves.toEqual({
      status: "REJECTED",
      code: "AUTH_SERVICE_UNAVAILABLE",
      message: "Authentication is temporarily unavailable.",
    });
  });
});

describe("signIn", () => {
  it("does not expose provider error details", async () => {
    const provider = createProvider();
    vi.mocked(provider.signInWithPassword).mockResolvedValue({
      data: { user: null },
      error: { message: "Internal provider detail" },
    });

    expect(
      await signIn(provider, {
        email: "operator@example.be",
        password: "correct horse battery staple",
      }),
    ).toEqual({
      status: "REJECTED",
      code: "AUTH_REQUEST_REJECTED",
      message: "Check your credentials and try again.",
    });
  });
});

describe("requestPasswordReset", () => {
  it("uses account-neutral completion copy", async () => {
    const provider = createProvider();

    expect(
      await requestPasswordReset(
        provider,
        { email: "operator@example.be" },
        "https://app.example.be/account/update-password",
      ),
    ).toEqual({ status: "PASSWORD_RESET_REQUESTED" });
  });
});
