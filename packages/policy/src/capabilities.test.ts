import { describe, expect, it } from "vitest";

import {
  decideCapabilityReadiness,
  decidePublicProjection,
  type CapabilityReadinessContext,
} from "./capabilities";

const readyContext: CapabilityReadinessContext = {
  authenticated: true,
  backendConfigured: true,
  deploymentConfigured: true,
  nodeEnrolled: true,
  policyApproved: true,
  modelApproved: true,
};

describe("decideCapabilityReadiness", () => {
  it.each([
    ["backendConfigured", "BACKEND_NOT_CONFIGURED"],
    ["authenticated", "AUTHENTICATION_REQUIRED"],
    ["deploymentConfigured", "DEPLOYMENT_NOT_CONFIGURED"],
    ["nodeEnrolled", "NODE_NOT_ENROLLED"],
    ["policyApproved", "POLICY_NOT_APPROVED"],
    ["modelApproved", "MODEL_NOT_APPROVED"],
  ] as const)("denies when %s is false", (field, reason) => {
    expect(
      decideCapabilityReadiness({ ...readyContext, [field]: false }),
    ).toEqual({ outcome: "DENIED", reason });
  });

  it("permits execution only when every required gate is ready", () => {
    expect(decideCapabilityReadiness(readyContext)).toEqual({
      outcome: "PERMITTED",
    });
  });
});

describe("decidePublicProjection", () => {
  it("denies restricted records even when publication was reviewed", () => {
    expect(
      decidePublicProjection({
        classification: "restricted",
        corroborated: true,
        humanReviewed: true,
        policyExplicitlyPermits: true,
        sensitiveMovement: false,
      }),
    ).toEqual({ outcome: "DENIED", reason: "CLASSIFICATION_NOT_PUBLIC" });
  });

  it("denies sensitive movements", () => {
    expect(
      decidePublicProjection({
        classification: "public",
        corroborated: true,
        humanReviewed: true,
        policyExplicitlyPermits: true,
        sensitiveMovement: true,
      }),
    ).toEqual({ outcome: "DENIED", reason: "SENSITIVE_MOVEMENT" });
  });

  it("requires corroboration, human review and explicit policy", () => {
    expect(
      decidePublicProjection({
        classification: "public",
        corroborated: false,
        humanReviewed: true,
        policyExplicitlyPermits: true,
        sensitiveMovement: false,
      }),
    ).toEqual({ outcome: "DENIED", reason: "NOT_CORROBORATED" });
  });

  it("permits only an explicitly approved public projection", () => {
    expect(
      decidePublicProjection({
        classification: "public",
        corroborated: true,
        humanReviewed: true,
        policyExplicitlyPermits: true,
        sensitiveMovement: false,
      }),
    ).toEqual({ outcome: "PERMITTED" });
  });
});
