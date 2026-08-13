import { describe, expect, it, vi } from "vitest";

import { createNodeEnrollment } from "./node-enrollment-service";

const validInput = {
  deploymentId: "0198a1e5-5468-7e22-9b70-a55af4fc1836",
  spaceId: "0198a1e5-5468-7f93-809d-23356f1ebda4",
  nodeLabel: "West entrance phone",
  captureZoneReference: "approved-zone-west-entrance",
  nodeRuntime: "BROWSER_PWA",
  requestedCapabilities: ["ALPR", "OBJECT_DETECTION"],
  acknowledgesApprovedCaptureZone: true,
  acknowledgesForegroundOnly: true,
  acknowledgesRawVideoStaysLocal: true,
} as const;

describe("createNodeEnrollment", () => {
  it("fails closed without a persistence provider", async () => {
    await expect(createNodeEnrollment(validInput)).resolves.toEqual({
      status: "STORAGE_NOT_PROVISIONED",
    });
  });

  it("rejects invalid input before calling the provider", async () => {
    const provider = { createEnrollment: vi.fn() };

    await expect(
      createNodeEnrollment(
        { ...validInput, acknowledgesApprovedCaptureZone: false },
        provider,
      ),
    ).resolves.toMatchObject({
      status: "REJECTED",
      code: "INVALID_NODE_ENROLLMENT",
    });
    expect(provider.createEnrollment).not.toHaveBeenCalled();
  });

  it("returns a validated provider result", async () => {
    const provider = {
      createEnrollment: vi.fn().mockResolvedValue({
        status: "ENROLLMENT_CLAIM_CREATED",
        enrollmentId: "0198a1e5-5468-70df-974c-f87ecbe684a9",
        enrollmentClaim: "dE4hR8gMsaCqYF4x2jw6P9uTZ_lK7bN3vQ1cX5eW0Ao",
        expiresAt: "2026-08-13T17:15:00.000Z",
      }),
    };

    await expect(createNodeEnrollment(validInput, provider)).resolves.toEqual({
      status: "ENROLLMENT_CLAIM_CREATED",
      enrollmentId: "0198a1e5-5468-70df-974c-f87ecbe684a9",
      enrollmentClaim: "dE4hR8gMsaCqYF4x2jw6P9uTZ_lK7bN3vQ1cX5eW0Ao",
      expiresAt: "2026-08-13T17:15:00.000Z",
    });
    expect(provider.createEnrollment).toHaveBeenCalledWith(validInput);
  });

  it("maps malformed provider output and failures to one stable rejection", async () => {
    const malformedProvider = {
      createEnrollment: vi.fn().mockResolvedValue({
        status: "ENROLLMENT_CLAIM_CREATED",
        enrollmentClaim: "short",
      }),
    };
    const failingProvider = {
      createEnrollment: vi.fn().mockRejectedValue(new Error("provider detail")),
    };

    await expect(
      createNodeEnrollment(validInput, malformedProvider),
    ).resolves.toMatchObject({
      status: "REJECTED",
      code: "NODE_ENROLLMENT_FAILED",
    });
    await expect(
      createNodeEnrollment(validInput, failingProvider),
    ).resolves.toMatchObject({
      status: "REJECTED",
      code: "NODE_ENROLLMENT_FAILED",
    });
  });

  it("returns an isolated provider failure result for every request", async () => {
    const provider = {
      createEnrollment: vi.fn().mockRejectedValue(new Error("failure")),
    };
    const first = await createNodeEnrollment(validInput, provider);
    if (first.status === "REJECTED") first.message = "mutated by consumer";

    await expect(createNodeEnrollment(validInput, provider)).resolves.toEqual({
      status: "REJECTED",
      code: "NODE_ENROLLMENT_FAILED",
      message: "Node enrollment could not be completed.",
    });
  });
});
