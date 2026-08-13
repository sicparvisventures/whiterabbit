import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address")
  .max(254, "Email address is too long");

const passwordSchema = z
  .string()
  .min(12, "Use at least 12 characters")
  .max(128, "Password is too long");

export const createAccountInputSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirmation: z.string(),
    acceptsTerms: z.boolean(),
  })
  .superRefine((input, context) => {
    if (input.password !== input.passwordConfirmation) {
      context.addIssue({
        code: "custom",
        message: "Passwords do not match",
        path: ["passwordConfirmation"],
      });
    }

    if (!input.acceptsTerms) {
      context.addIssue({
        code: "custom",
        message: "Accept the terms to continue",
        path: ["acceptsTerms"],
      });
    }
  });

export const signInInputSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password").max(128),
});

export const passwordResetInputSchema = z.object({
  email: emailSchema,
});

export const accountMutationResultSchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("CREATED"),
    userId: z.uuid(),
    requiresEmailVerification: z.boolean(),
  }),
  z.object({
    status: z.literal("SIGNED_IN"),
    userId: z.uuid(),
  }),
  z.object({ status: z.literal("SIGNED_OUT") }),
  z.object({ status: z.literal("PASSWORD_RESET_REQUESTED") }),
  z.object({ status: z.literal("BACKEND_NOT_CONFIGURED") }),
  z.object({
    status: z.literal("REJECTED"),
    code: z.string().min(1).max(64),
    message: z.string().min(1).max(240),
  }),
]);

export type AccountMutationResult = z.infer<typeof accountMutationResultSchema>;
export type CreateAccountInput = z.infer<typeof createAccountInputSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetInputSchema>;
export type SignInInput = z.infer<typeof signInInputSchema>;
