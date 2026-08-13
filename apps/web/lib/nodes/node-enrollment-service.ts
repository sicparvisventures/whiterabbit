import {
  createNodeEnrollmentInputSchema,
  nodeEnrollmentResultSchema,
  type CreateNodeEnrollmentInput,
  type NodeEnrollmentResult,
} from "@whiterabbit/contracts/node";

export type NodeEnrollmentProvider = Readonly<{
  createEnrollment(input: CreateNodeEnrollmentInput): Promise<unknown>;
}>;

function createProviderFailure(): NodeEnrollmentResult {
  return {
    status: "REJECTED",
    code: "NODE_ENROLLMENT_FAILED",
    message: "Node enrollment could not be completed.",
  };
}

export async function createNodeEnrollment(
  rawInput: unknown,
  provider?: NodeEnrollmentProvider,
): Promise<NodeEnrollmentResult> {
  const parsedInput = createNodeEnrollmentInputSchema.safeParse(rawInput);
  if (!parsedInput.success) {
    return {
      status: "REJECTED",
      code: "INVALID_NODE_ENROLLMENT",
      message: "Review the node enrollment details and acknowledgements.",
    };
  }

  if (!provider) return { status: "STORAGE_NOT_PROVISIONED" };

  try {
    const parsedResult = nodeEnrollmentResultSchema.safeParse(
      await provider.createEnrollment(parsedInput.data),
    );
    return parsedResult.success ? parsedResult.data : createProviderFailure();
  } catch {
    return createProviderFailure();
  }
}
