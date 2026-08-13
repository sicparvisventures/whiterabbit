import { describe, expect, it } from "vitest";

import {
  createOrganizationInputSchema,
  organizationSetupStateSchema,
} from "./organization";

const validInput = {
  organizationName: "  Federal Service Lab  ",
  deploymentLabel: "  Brussels pilot  ",
  controllerProfile: "BE-DEFENCE-ADMIN",
  purposeSummary:
    "Evaluate an accountable entrance workflow using approved synthetic inputs.",
  requestedCapabilities: ["ALPR", "OBJECT_DETECTION"],
  acknowledgesClassificationBoundary: true,
} as const;

describe("createOrganizationInputSchema", () => {
  it("normalizes a valid first deployment", () => {
    const result = createOrganizationInputSchema.parse(validInput);

    expect(result.organizationName).toBe("Federal Service Lab");
    expect(result.deploymentLabel).toBe("Brussels pilot");
  });

  it("rejects unknown controller profiles", () => {
    expect(
      createOrganizationInputSchema.safeParse({
        ...validInput,
        controllerProfile: "BELGIAN-STATE",
      }).success,
    ).toBe(false);
  });

  it("does not expose biometrics as a baseline capability", () => {
    expect(
      createOrganizationInputSchema.safeParse({
        ...validInput,
        requestedCapabilities: ["ALPR", "BIOMETRIC_IDENTIFICATION"],
      }).success,
    ).toBe(false);
  });

  it("requires the classification boundary acknowledgement", () => {
    expect(
      createOrganizationInputSchema.safeParse({
        ...validInput,
        acknowledgesClassificationBoundary: false,
      }).success,
    ).toBe(false);
  });
});

describe("organizationSetupStateSchema", () => {
  it("represents missing persistence without an invented organization", () => {
    const result = organizationSetupStateSchema.parse({
      status: "STORAGE_NOT_PROVISIONED",
    });

    expect(result).not.toHaveProperty("organizationId");
  });
});
