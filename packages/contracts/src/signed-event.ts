import { z } from "zod";

import { controllerProfileSchema } from "./organization";

const base64UrlSha256Schema = z
  .string()
  .length(43)
  .regex(/^[A-Za-z0-9_-]{43}$/);

const fixedWidthEs256JoseSignatureSchema = z
  .string()
  .length(86)
  .regex(/^[A-Za-z0-9_-]{86}$/);

const opaqueReferenceSchema = z.string().min(1).max(128);

export const baselineEventTypeSchema = z.enum([
  "node.heartbeat.v1",
  "node.security.v1",
  "alpr.candidate.v1",
  "object.observation.v1",
]);

export const dataClassificationSchema = z.enum([
  "PUBLIC",
  "OFFICIAL",
  "RESTRICTED",
  "CLASSIFIED",
]);

export const dataNatureSchema = z.enum(["SYNTHETIC", "REAL"]);

export const baselineEventHeaderSchema = z.strictObject({
  schemaVersion: z.literal("whiterabbit.event.v1"),
  eventType: baselineEventTypeSchema,
  eventId: z.uuid({ version: "v7" }),
  deploymentId: z.uuid(),
  spaceId: z.uuid(),
  nodeId: z.uuid(),
  keyId: opaqueReferenceSchema,
  counterEpochId: z.uuid(),
  sequence: z.string().regex(/^(0|[1-9][0-9]*)$/),
  occurredAt: z.iso.datetime({ offset: false, precision: 3 }),
  controllerProfile: controllerProfileSchema,
  purposeId: opaqueReferenceSchema,
  policyVersion: opaqueReferenceSchema,
  capabilityAuthorityId: opaqueReferenceSchema,
  classification: dataClassificationSchema,
  dataNature: dataNatureSchema,
  previousEventDigest: base64UrlSha256Schema.optional(),
});

export const eventSignatureSchema = z.strictObject({
  algorithm: z.literal("ES256"),
  value: fixedWidthEs256JoseSignatureSchema,
});

export type BaselineEventHeader = z.infer<typeof baselineEventHeaderSchema>;
export type BaselineEventType = z.infer<typeof baselineEventTypeSchema>;
export type DataClassification = z.infer<typeof dataClassificationSchema>;
export type DataNature = z.infer<typeof dataNatureSchema>;
export type EventSignature = z.infer<typeof eventSignatureSchema>;
