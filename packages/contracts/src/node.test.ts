import { describe, expect, it } from "vitest";

import {
  createNodeEnrollmentInputSchema,
  nodeEnrollmentResultSchema,
} from "./node";

const validInput = {
  deploymentId: "0198a1e5-5468-7e22-9b70-a55af4fc1836",
  spaceId: "0198a1e5-5468-7f93-809d-23356f1ebda4",
  nodeLabel: "  West entrance phone  ",
  captureZoneReference: "  approved-zone-west-entrance  ",
  nodeRuntime: "BROWSER_PWA",
  requestedCapabilities: ["ALPR", "OBJECT_DETECTION"],
  acknowledgesApprovedCaptureZone: true,
  acknowledgesForegroundOnly: true,
  acknowledgesRawVideoStaysLocal: true,
} as const;

describe("createNodeEnrollmentInputSchema", () => {
  it("normalizes a browser node request without human or controller identity", () => {
    const result = createNodeEnrollmentInputSchema.parse(validInput);

    expect(result.nodeLabel).toBe("West entrance phone");
    expect(result.captureZoneReference).toBe("approved-zone-west-entrance");
    expect(result).not.toHaveProperty("userId");
    expect(result).not.toHaveProperty("controllerProfile");
  });

  it("rejects biometrics from baseline node enrollment", () => {
    expect(
      createNodeEnrollmentInputSchema.safeParse({
        ...validInput,
        requestedCapabilities: ["ALPR", "BIOMETRIC_IDENTIFICATION"],
      }).success,
    ).toBe(false);
  });

  it("requires every local capture boundary acknowledgement", () => {
    expect(
      createNodeEnrollmentInputSchema.safeParse({
        ...validInput,
        acknowledgesRawVideoStaysLocal: false,
      }).success,
    ).toBe(false);
  });

  it("rejects coordinates and other undeclared enrollment authority", () => {
    expect(
      createNodeEnrollmentInputSchema.safeParse({
        ...validInput,
        latitude: 50.8503,
        longitude: 4.3517,
      }).success,
    ).toBe(false);
  });
});

describe("nodeEnrollmentResultSchema", () => {
  it("represents unavailable storage without manufacturing a node or claim", () => {
    const result = nodeEnrollmentResultSchema.parse({
      status: "STORAGE_NOT_PROVISIONED",
    });

    expect(result).not.toHaveProperty("nodeId");
    expect(result).not.toHaveProperty("enrollmentClaim");
  });

  it("accepts only an opaque minimum-length claim in the explicit success variant", () => {
    const result = nodeEnrollmentResultSchema.parse({
      status: "ENROLLMENT_CLAIM_CREATED",
      enrollmentId: "0198a1e5-5468-70df-974c-f87ecbe684a9",
      enrollmentClaim: "dE4hR8gMsaCqYF4x2jw6P9uTZ_lK7bN3vQ1cX5eW0Ao",
      expiresAt: "2026-08-13T17:15:00.000Z",
    });

    expect(result.status).toBe("ENROLLMENT_CLAIM_CREATED");
    expect(
      nodeEnrollmentResultSchema.safeParse({
        status: "ENROLLMENT_CLAIM_CREATED",
        enrollmentId: "0198a1e5-5468-70df-974c-f87ecbe684a9",
        enrollmentClaim: "too-short",
        expiresAt: "2026-08-13T17:15:00.000Z",
      }).success,
    ).toBe(false);
  });

  it("requires the enrollment claim expiry to be UTC", () => {
    expect(
      nodeEnrollmentResultSchema.safeParse({
        status: "ENROLLMENT_CLAIM_CREATED",
        enrollmentId: "0198a1e5-5468-70df-974c-f87ecbe684a9",
        enrollmentClaim: "dE4hR8gMsaCqYF4x2jw6P9uTZ_lK7bN3vQ1cX5eW0Ao",
        expiresAt: "2026-08-13T19:15:00.000+02:00",
      }).success,
    ).toBe(false);
  });
});
