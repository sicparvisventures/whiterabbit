import { describe, expect, it } from "vitest";

import {
  alprCandidateEventSchema,
  objectObservationEventSchema,
} from "./baseline-events";

const signedScope = {
  schemaVersion: "whiterabbit.event.v1",
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
} as const;

const signature = {
  algorithm: "ES256",
  value: "A".repeat(86),
} as const;

const modelRef = {
  purpose: "vehicle-detection",
  version: "1.0.0",
  digest: "B".repeat(43),
};

const validAlprEvent = {
  header: { ...signedScope, eventType: "alpr.candidate.v1" },
  payload: {
    candidateId: "0198a1e5-5468-7e31-85f3-004f3ea1a822",
    observationWindow: {
      start: "2026-08-13T17:14:59.000Z",
      end: "2026-08-13T17:15:00.000Z",
    },
    plateToken: "C".repeat(43),
    plateRegionHint: "BE",
    governmentFleetHypothesis: "CANDIDATE",
    vehicleCategories: ["PASSENGER_CAR"],
    corroborationCount: 2,
    qualityBand: "REVIEWABLE",
    modelRefs: [modelRef],
  },
  signature,
} as const;

const validObjectEvent = {
  header: { ...signedScope, eventType: "object.observation.v1" },
  payload: {
    observationId: "0198a1e5-5468-7f44-9197-1da0f1cb3421",
    observationWindow: {
      start: "2026-08-13T17:14:59.000Z",
      end: "2026-08-13T17:15:00.000Z",
    },
    categories: ["VEHICLE", "PERSON_PRESENCE"],
    counts: { VEHICLE: 1, PERSON_PRESENCE: 2 },
    localTrackToken: "track_01K2M9C7Q1",
    qualityBand: "REVIEWABLE",
    modelRefs: [modelRef],
  },
  signature,
} as const;

describe("alprCandidateEventSchema", () => {
  it("accepts a minimized signed ALPR candidate", () => {
    expect(alprCandidateEventSchema.parse(validAlprEvent)).toEqual(
      validAlprEvent,
    );
  });

  it("rejects raw plate text and evidence before the evidence path is enabled", () => {
    expect(
      alprCandidateEventSchema.safeParse({
        ...validAlprEvent,
        payload: { ...validAlprEvent.payload, rawPlate: "forbidden" },
      }).success,
    ).toBe(false);
    expect(
      alprCandidateEventSchema.safeParse({
        ...validAlprEvent,
        payload: {
          ...validAlprEvent.payload,
          evidence: {
            evidenceId: "0198a1e5-5468-7b81-9914-d3b1b3449f1f",
            mediaType: "image/jpeg",
            byteLength: 1024,
            sha256: "D".repeat(43),
            encryptionKeyRef: "key_01K2MAQ10G",
            redactionProfile: "redaction-1",
            expiresAt: "2026-08-14T17:15:00.000Z",
          },
        },
      }).success,
    ).toBe(false);
  });

  it("requires a deployment-scoped pseudonymous plate token", () => {
    expect(
      alprCandidateEventSchema.safeParse({
        ...validAlprEvent,
        payload: { ...validAlprEvent.payload, plateToken: "1-ABC-123" },
      }).success,
    ).toBe(false);
  });

  it("binds the payload to the ALPR event type", () => {
    expect(
      alprCandidateEventSchema.safeParse({
        ...validAlprEvent,
        header: {
          ...validAlprEvent.header,
          eventType: "object.observation.v1",
        },
      }).success,
    ).toBe(false);
  });
});

describe("objectObservationEventSchema", () => {
  it("accepts non-identifying category counts", () => {
    expect(objectObservationEventSchema.parse(validObjectEvent)).toEqual(
      validObjectEvent,
    );
  });

  it("rejects unknown object and count categories", () => {
    expect(
      objectObservationEventSchema.safeParse({
        ...validObjectEvent,
        payload: {
          ...validObjectEvent.payload,
          categories: ["FACE_IDENTITY"],
          counts: { FACE_IDENTITY: 1 },
        },
      }).success,
    ).toBe(false);
  });

  it("rejects embeddings and persistent person identifiers", () => {
    for (const forbidden of [
      { embedding: [0.1, 0.2] },
      { subjectRef: "person-1" },
      { crossCameraTrackToken: "global-track" },
    ]) {
      expect(
        objectObservationEventSchema.safeParse({
          ...validObjectEvent,
          payload: { ...validObjectEvent.payload, ...forbidden },
        }).success,
      ).toBe(false);
    }
  });

  it("requires the observation window to end at or after it starts", () => {
    expect(
      objectObservationEventSchema.safeParse({
        ...validObjectEvent,
        payload: {
          ...validObjectEvent.payload,
          observationWindow: {
            start: "2026-08-13T17:15:01.000Z",
            end: "2026-08-13T17:15:00.000Z",
          },
        },
      }).success,
    ).toBe(false);
  });
});
