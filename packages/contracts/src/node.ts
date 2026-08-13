import { z } from "zod";

import { baselineCapabilitySchema } from "./organization";

const affirmativeAcknowledgementSchema = z.literal(true);
const opaqueEnrollmentClaimSchema = z
  .string()
  .min(43)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

export const createNodeEnrollmentInputSchema = z.strictObject({
  deploymentId: z.uuid(),
  spaceId: z.uuid(),
  nodeLabel: z.string().trim().min(2).max(100),
  captureZoneReference: z.string().trim().min(3).max(120),
  nodeRuntime: z.literal("BROWSER_PWA"),
  requestedCapabilities: z
    .array(baselineCapabilitySchema)
    .min(1)
    .max(2)
    .refine(
      (capabilities) => new Set(capabilities).size === capabilities.length,
      "Capabilities must be unique",
    ),
  acknowledgesApprovedCaptureZone: affirmativeAcknowledgementSchema,
  acknowledgesForegroundOnly: affirmativeAcknowledgementSchema,
  acknowledgesRawVideoStaysLocal: affirmativeAcknowledgementSchema,
});

export const nodeEnrollmentResultSchema = z.discriminatedUnion("status", [
  z.strictObject({ status: z.literal("STORAGE_NOT_PROVISIONED") }),
  z.strictObject({ status: z.literal("AUTHENTICATION_REQUIRED") }),
  z.strictObject({ status: z.literal("STEP_UP_REQUIRED") }),
  z.strictObject({ status: z.literal("POLICY_NOT_READY") }),
  z.strictObject({
    status: z.literal("ENROLLMENT_CLAIM_CREATED"),
    enrollmentId: z.uuid(),
    // Sensitive one-time material: consumers must never persist or log this value.
    enrollmentClaim: opaqueEnrollmentClaimSchema,
    expiresAt: z.iso.datetime(),
  }),
  z.strictObject({
    status: z.literal("REJECTED"),
    code: z.string().min(1).max(64),
    message: z.string().min(1).max(240),
  }),
]);

export type CreateNodeEnrollmentInput = z.infer<
  typeof createNodeEnrollmentInputSchema
>;
export type NodeEnrollmentResult = z.infer<typeof nodeEnrollmentResultSchema>;
