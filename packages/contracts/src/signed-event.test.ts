import { describe, expect, it } from "vitest";

import {
  baselineEventHeaderSchema,
  eventSignatureSchema,
} from "./signed-event";

const validHeader = {
  schemaVersion: "whiterabbit.event.v1",
  eventType: "object.observation.v1",
  eventId: "0198a1e5-5468-7e22-9b70-a55af4fc1836",
  deploymentId: "0198a1e5-5468-6e22-9b70-a55af4fc1836",
  spaceId: "0198a1e5-5468-4f93-809d-23356f1ebda4",
  nodeId: "0198a1e5-5468-40df-974c-f87ecbe684a9",
  keyId: "key_01K2M7Y8R9P0",
  counterEpochId: "0198a1e5-5468-4f11-903a-f5bc32381923",
  sequence: "42",
  occurredAt: "2026-08-13T17:15:00.000Z",
  controllerProfile: "BE-DEFENCE-ADMIN",
  purposeId: "purpose_01K2M81Q9Y",
  policyVersion: "policy-2026.08",
  capabilityAuthorityId: "authority_01K2M83S5F",
  classification: "OFFICIAL",
  dataNature: "SYNTHETIC",
  previousEventDigest: "A".repeat(43),
} as const;

describe("baselineEventHeaderSchema", () => {
  it("accepts the complete scoped baseline event header", () => {
    expect(baselineEventHeaderSchema.parse(validHeader)).toEqual(validHeader);
  });

  it("rejects biometric events at the baseline contract boundary", () => {
    expect(
      baselineEventHeaderSchema.safeParse({
        ...validHeader,
        eventType: "biometric.candidate.v1",
      }).success,
    ).toBe(false);
  });

  it("requires a UUIDv7 event identifier", () => {
    expect(
      baselineEventHeaderSchema.safeParse({
        ...validHeader,
        eventId: "550e8400-e29b-41d4-a716-446655440000",
      }).success,
    ).toBe(false);
  });

  it("requires canonical unsigned decimal sequences", () => {
    for (const sequence of ["-1", "+1", "01", "1.0"]) {
      expect(
        baselineEventHeaderSchema.safeParse({ ...validHeader, sequence })
          .success,
      ).toBe(false);
    }
  });

  it("requires UTC timestamps with millisecond precision", () => {
    for (const occurredAt of [
      "2026-08-13T17:15:00Z",
      "2026-08-13T19:15:00.000+02:00",
    ]) {
      expect(
        baselineEventHeaderSchema.safeParse({ ...validHeader, occurredAt })
          .success,
      ).toBe(false);
    }
  });

  it("rejects non-digest values and undeclared signed fields", () => {
    expect(
      baselineEventHeaderSchema.safeParse({
        ...validHeader,
        previousEventDigest: "not-a-digest",
      }).success,
    ).toBe(false);
    expect(
      baselineEventHeaderSchema.safeParse({
        ...validHeader,
        rawPlate: "forbidden",
      }).success,
    ).toBe(false);
  });
});

describe("eventSignatureSchema", () => {
  it("accepts only a fixed-width base64url ES256 JOSE signature", () => {
    expect(
      eventSignatureSchema.parse({
        algorithm: "ES256",
        value: "A".repeat(86),
      }),
    ).toEqual({ algorithm: "ES256", value: "A".repeat(86) });

    expect(
      eventSignatureSchema.safeParse({
        algorithm: "ES256",
        value: "A".repeat(85),
      }).success,
    ).toBe(false);
    expect(
      eventSignatureSchema.safeParse({
        algorithm: "EdDSA",
        value: "A".repeat(86),
      }).success,
    ).toBe(false);
  });
});
