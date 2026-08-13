export type SupabasePublicConfig =
  | { status: "NOT_CONFIGURED" }
  | {
      status: "INVALID";
      reason:
        | "INCOMPLETE_CONFIGURATION"
        | "INVALID_PROJECT_URL"
        | "INVALID_PUBLISHABLE_KEY";
    }
  | {
      status: "CONFIGURED";
      url: string;
      publishableKey: string;
    };

type PublicEnvironment = Readonly<{
  NEXT_PUBLIC_SUPABASE_URL?: string | undefined;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string | undefined;
}>;

export function readSupabasePublicConfig(
  environment: PublicEnvironment,
): SupabasePublicConfig {
  const urlValue = environment.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const keyValue = environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!urlValue && !keyValue) {
    return { status: "NOT_CONFIGURED" };
  }

  if (!urlValue || !keyValue) {
    return { status: "INVALID", reason: "INCOMPLETE_CONFIGURATION" };
  }

  let projectUrl: URL;
  try {
    projectUrl = new URL(urlValue);
  } catch {
    return { status: "INVALID", reason: "INVALID_PROJECT_URL" };
  }

  if (
    projectUrl.protocol !== "https:" ||
    projectUrl.username ||
    projectUrl.password ||
    projectUrl.search ||
    projectUrl.hash
  ) {
    return { status: "INVALID", reason: "INVALID_PROJECT_URL" };
  }

  if (keyValue.length < 20) {
    return { status: "INVALID", reason: "INVALID_PUBLISHABLE_KEY" };
  }

  return {
    status: "CONFIGURED",
    url: projectUrl.toString().replace(/\/$/, ""),
    publishableKey: keyValue,
  };
}

export function readRuntimeSupabasePublicConfig(): SupabasePublicConfig {
  return readSupabasePublicConfig({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}
