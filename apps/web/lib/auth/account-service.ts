import {
  accountMutationResultSchema,
  createAccountInputSchema,
  passwordResetInputSchema,
  signInInputSchema,
  type AccountMutationResult,
} from "@whiterabbit/contracts/account";

type ProviderError = { message: string } | null;
type ProviderUser = { id: string } | null;

export type AccountAuthProvider = Readonly<{
  signUp(credentials: { email: string; password: string }): Promise<{
    data: { user: ProviderUser; session: unknown | null };
    error: ProviderError;
  }>;
  signInWithPassword(credentials: {
    email: string;
    password: string;
  }): Promise<{
    data: { user: ProviderUser };
    error: ProviderError;
  }>;
  resetPasswordForEmail(
    email: string,
    options: { redirectTo: string },
  ): Promise<{ error: ProviderError }>;
}>;

const invalidInputResult: AccountMutationResult = {
  status: "REJECTED",
  code: "INVALID_INPUT",
  message: "Check the highlighted information and try again.",
};

function providerRejected(message: string): AccountMutationResult {
  return {
    status: "REJECTED",
    code: "AUTH_REQUEST_REJECTED",
    message,
  };
}

function serviceUnavailable(): AccountMutationResult {
  return {
    status: "REJECTED",
    code: "AUTH_SERVICE_UNAVAILABLE",
    message: "Authentication is temporarily unavailable.",
  };
}

export async function createAccount(
  provider: AccountAuthProvider | null,
  input: unknown,
): Promise<AccountMutationResult> {
  const parsed = createAccountInputSchema.safeParse(input);
  if (!parsed.success) return invalidInputResult;
  if (!provider) return { status: "BACKEND_NOT_CONFIGURED" };

  let response: Awaited<ReturnType<AccountAuthProvider["signUp"]>>;
  try {
    response = await provider.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
    });
  } catch {
    return serviceUnavailable();
  }

  const { data, error } = response;

  if (error || !data.user) {
    return providerRejected(
      "We could not create the account. Try again later.",
    );
  }

  const result = accountMutationResultSchema.safeParse({
    status: "CREATED",
    userId: data.user.id,
    requiresEmailVerification: data.session === null,
  });

  return result.success
    ? result.data
    : providerRejected("We could not verify the account response.");
}

export async function signIn(
  provider: AccountAuthProvider | null,
  input: unknown,
): Promise<AccountMutationResult> {
  const parsed = signInInputSchema.safeParse(input);
  if (!parsed.success) return invalidInputResult;
  if (!provider) return { status: "BACKEND_NOT_CONFIGURED" };

  let response: Awaited<ReturnType<AccountAuthProvider["signInWithPassword"]>>;
  try {
    response = await provider.signInWithPassword(parsed.data);
  } catch {
    return serviceUnavailable();
  }

  const { data, error } = response;
  if (error || !data.user) {
    return providerRejected("Check your credentials and try again.");
  }

  const result = accountMutationResultSchema.safeParse({
    status: "SIGNED_IN",
    userId: data.user.id,
  });

  return result.success
    ? result.data
    : providerRejected("We could not verify the session response.");
}

export async function requestPasswordReset(
  provider: AccountAuthProvider | null,
  input: unknown,
  redirectTo: string,
): Promise<AccountMutationResult> {
  const parsed = passwordResetInputSchema.safeParse(input);
  if (!parsed.success) return invalidInputResult;
  if (!provider) return { status: "BACKEND_NOT_CONFIGURED" };

  let response: Awaited<
    ReturnType<AccountAuthProvider["resetPasswordForEmail"]>
  >;
  try {
    response = await provider.resetPasswordForEmail(parsed.data.email, {
      redirectTo,
    });
  } catch {
    return serviceUnavailable();
  }

  const { error } = response;

  if (error) {
    return providerRejected("We could not send the request. Try again later.");
  }

  return { status: "PASSWORD_RESET_REQUESTED" };
}
