export type CapabilityReadinessContext = Readonly<{
  authenticated: boolean;
  backendConfigured: boolean;
  deploymentConfigured: boolean;
  nodeEnrolled: boolean;
  policyApproved: boolean;
  modelApproved: boolean;
}>;

export type CapabilityReadinessDecision =
  | { outcome: "PERMITTED" }
  | {
      outcome: "DENIED";
      reason:
        | "BACKEND_NOT_CONFIGURED"
        | "AUTHENTICATION_REQUIRED"
        | "DEPLOYMENT_NOT_CONFIGURED"
        | "NODE_NOT_ENROLLED"
        | "POLICY_NOT_APPROVED"
        | "MODEL_NOT_APPROVED";
    };

export function decideCapabilityReadiness(
  context: CapabilityReadinessContext,
): CapabilityReadinessDecision {
  if (!context.backendConfigured) {
    return { outcome: "DENIED", reason: "BACKEND_NOT_CONFIGURED" };
  }

  if (!context.authenticated) {
    return { outcome: "DENIED", reason: "AUTHENTICATION_REQUIRED" };
  }

  if (!context.deploymentConfigured) {
    return { outcome: "DENIED", reason: "DEPLOYMENT_NOT_CONFIGURED" };
  }

  if (!context.nodeEnrolled) {
    return { outcome: "DENIED", reason: "NODE_NOT_ENROLLED" };
  }

  if (!context.policyApproved) {
    return { outcome: "DENIED", reason: "POLICY_NOT_APPROVED" };
  }

  if (!context.modelApproved) {
    return { outcome: "DENIED", reason: "MODEL_NOT_APPROVED" };
  }

  return { outcome: "PERMITTED" };
}

export type PublicProjectionContext = Readonly<{
  classification: "public" | "official" | "restricted" | "classified";
  corroborated: boolean;
  humanReviewed: boolean;
  policyExplicitlyPermits: boolean;
  sensitiveMovement: boolean;
}>;

export type PublicProjectionDecision =
  | { outcome: "PERMITTED" }
  | {
      outcome: "DENIED";
      reason:
        | "CLASSIFICATION_NOT_PUBLIC"
        | "SENSITIVE_MOVEMENT"
        | "POLICY_NOT_APPROVED"
        | "NOT_CORROBORATED"
        | "HUMAN_REVIEW_REQUIRED";
    };

export function decidePublicProjection(
  context: PublicProjectionContext,
): PublicProjectionDecision {
  if (context.classification !== "public") {
    return { outcome: "DENIED", reason: "CLASSIFICATION_NOT_PUBLIC" };
  }

  if (context.sensitiveMovement) {
    return { outcome: "DENIED", reason: "SENSITIVE_MOVEMENT" };
  }

  if (!context.policyExplicitlyPermits) {
    return { outcome: "DENIED", reason: "POLICY_NOT_APPROVED" };
  }

  if (!context.corroborated) {
    return { outcome: "DENIED", reason: "NOT_CORROBORATED" };
  }

  if (!context.humanReviewed) {
    return { outcome: "DENIED", reason: "HUMAN_REVIEW_REQUIRED" };
  }

  return { outcome: "PERMITTED" };
}
