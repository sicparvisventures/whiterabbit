import { z } from "zod";

export const controllerProfileSchema = z.enum([
  "BE-DEFENCE-ADMIN",
  "BE-ARMED-FORCES-OPS",
  "BE-INTEL",
  "BE-POLICE",
  "BE-MUNICIPAL",
]);

export const baselineCapabilitySchema = z.enum(["ALPR", "OBJECT_DETECTION"]);

export const createOrganizationInputSchema = z
  .object({
    organizationName: z.string().trim().min(2).max(100),
    deploymentLabel: z.string().trim().min(2).max(100),
    controllerProfile: controllerProfileSchema,
    purposeSummary: z.string().trim().min(20).max(500),
    requestedCapabilities: z
      .array(baselineCapabilitySchema)
      .min(1)
      .max(2)
      .refine(
        (capabilities) => new Set(capabilities).size === capabilities.length,
        "Capabilities must be unique",
      ),
    acknowledgesClassificationBoundary: z.boolean(),
  })
  .superRefine((input, context) => {
    if (!input.acknowledgesClassificationBoundary) {
      context.addIssue({
        code: "custom",
        message: "Acknowledge the classification boundary to continue",
        path: ["acknowledgesClassificationBoundary"],
      });
    }
  });

export const organizationSetupStateSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("NOT_STARTED") }),
  z.object({ status: z.literal("STORAGE_NOT_PROVISIONED") }),
  z.object({
    status: z.literal("READY"),
    organizationId: z.uuid(),
    deploymentId: z.uuid(),
  }),
]);

export type BaselineCapability = z.infer<typeof baselineCapabilitySchema>;
export type ControllerProfile = z.infer<typeof controllerProfileSchema>;
export type CreateOrganizationInput = z.infer<
  typeof createOrganizationInputSchema
>;
export type OrganizationSetupState = z.infer<
  typeof organizationSetupStateSchema
>;
