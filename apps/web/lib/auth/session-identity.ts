export type SessionIdentity =
  | { status: "UNAUTHENTICATED" }
  | {
      status: "AUTHENTICATED";
      userId: string;
      email: string;
      initials: string;
    };

export function deriveSessionIdentity(claims: unknown): SessionIdentity {
  if (!claims || typeof claims !== "object") {
    return { status: "UNAUTHENTICATED" };
  }

  const subject = Reflect.get(claims, "sub");
  const rawEmail = Reflect.get(claims, "email");
  if (typeof subject !== "string" || typeof rawEmail !== "string") {
    return { status: "UNAUTHENTICATED" };
  }

  const email = rawEmail.trim().toLowerCase();
  const separator = email.indexOf("@");
  if (!subject || separator < 1 || email.includes(" ")) {
    return { status: "UNAUTHENTICATED" };
  }

  const localPart = email.slice(0, separator);
  const initials = localPart
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 2)
    .toUpperCase();
  if (!initials) return { status: "UNAUTHENTICATED" };

  return {
    status: "AUTHENTICATED",
    userId: subject,
    email,
    initials,
  };
}
