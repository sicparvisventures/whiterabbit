export type ConfirmationType =
  "email" | "signup" | "invite" | "magiclink" | "recovery" | "email_change";

export type ConfirmationRequest =
  | { status: "INVALID" }
  | {
      status: "VALID";
      tokenHash: string;
      type: ConfirmationType;
      nextPath: string;
    };

const supportedTypes = new Set<ConfirmationType>([
  "email",
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
]);

function isLocalPath(path: string): boolean {
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\");
}

export function parseConfirmationRequest(url: URL): ConfirmationRequest {
  const tokenHash = url.searchParams.get("token_hash")?.trim();
  const rawType = url.searchParams.get("type")?.trim();

  if (
    !tokenHash ||
    tokenHash.length > 4096 ||
    !rawType ||
    !supportedTypes.has(rawType as ConfirmationType)
  ) {
    return { status: "INVALID" };
  }

  const requestedNext = url.searchParams.get("next");
  const defaultNext =
    rawType === "recovery" ? "/account/update-password" : "/app/setup";
  const nextPath = requestedNext ?? defaultNext;
  if (!isLocalPath(nextPath)) return { status: "INVALID" };

  return {
    status: "VALID",
    tokenHash,
    type: rawType as ConfirmationType,
    nextPath,
  };
}
