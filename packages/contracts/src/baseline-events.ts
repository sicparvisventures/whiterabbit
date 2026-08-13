import { z } from "zod";

import {
  baselineEventHeaderSchema,
  eventSignatureSchema,
  opaqueEventReferenceSchema,
  sha256DigestSchema,
  utcMillisecondsSchema,
} from "./signed-event";

const observationWindowSchema = z
  .strictObject({
    start: utcMillisecondsSchema,
    end: utcMillisecondsSchema,
  })
  .superRefine((window, context) => {
    if (Date.parse(window.end) < Date.parse(window.start)) {
      context.addIssue({
        code: "custom",
        message: "Observation end must not precede its start",
        path: ["end"],
      });
    }
  });

export const modelReferenceSchema = z.strictObject({
  purpose: opaqueEventReferenceSchema,
  version: opaqueEventReferenceSchema,
  digest: sha256DigestSchema,
});

const plateTokenSchema = z
  .string()
  .min(43)
  .max(128)
  .regex(/^[A-Za-z0-9_-]+$/);

const vehicleCategorySchema = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[A-Z][A-Z0-9_]*$/);

export const alprCandidatePayloadSchema = z.strictObject({
  candidateId: z.uuid(),
  observationWindow: observationWindowSchema,
  plateToken: plateTokenSchema,
  plateRegionHint: z.enum(["BE", "UNKNOWN"]).optional(),
  governmentFleetHypothesis: z.enum(["CANDIDATE", "NOT_SUPPORTED"]),
  vehicleCategories: z
    .array(vehicleCategorySchema)
    .min(1)
    .max(12)
    .refine(
      (categories) => new Set(categories).size === categories.length,
      "Vehicle categories must be unique",
    ),
  corroborationCount: z.number().int().nonnegative().safe(),
  qualityBand: z.enum(["REVIEWABLE", "LIMITED"]),
  modelRefs: z.array(modelReferenceSchema).min(1).max(8),
});

export const objectCategorySchema = z.enum([
  "VEHICLE",
  "PERSON_PRESENCE",
  "ANIMAL",
  "OBSTRUCTION",
  "MOTION",
  "TAMPER",
]);

export const objectObservationPayloadSchema = z.strictObject({
  observationId: z.uuid(),
  observationWindow: observationWindowSchema,
  categories: z
    .array(objectCategorySchema)
    .min(1)
    .max(6)
    .refine(
      (categories) => new Set(categories).size === categories.length,
      "Object categories must be unique",
    ),
  counts: z
    .partialRecord(objectCategorySchema, z.number().int().nonnegative().safe())
    .optional(),
  localTrackToken: opaqueEventReferenceSchema.optional(),
  qualityBand: z.enum(["REVIEWABLE", "LIMITED"]),
  modelRefs: z.array(modelReferenceSchema).min(1).max(8),
});

export const alprCandidateEventSchema = z.strictObject({
  header: baselineEventHeaderSchema.extend({
    eventType: z.literal("alpr.candidate.v1"),
  }),
  payload: alprCandidatePayloadSchema,
  signature: eventSignatureSchema,
});

export const objectObservationEventSchema = z.strictObject({
  header: baselineEventHeaderSchema.extend({
    eventType: z.literal("object.observation.v1"),
  }),
  payload: objectObservationPayloadSchema,
  signature: eventSignatureSchema,
});

export type AlprCandidateEvent = z.infer<typeof alprCandidateEventSchema>;
export type AlprCandidatePayload = z.infer<typeof alprCandidatePayloadSchema>;
export type ModelReference = z.infer<typeof modelReferenceSchema>;
export type ObjectCategory = z.infer<typeof objectCategorySchema>;
export type ObjectObservationEvent = z.infer<
  typeof objectObservationEventSchema
>;
export type ObjectObservationPayload = z.infer<
  typeof objectObservationPayloadSchema
>;
