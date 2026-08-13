export type InstallState =
  "INSTALLED" | "PROMPT_AVAILABLE" | "IOS_MANUAL" | "UNAVAILABLE";

export function resolveInstallState(capability: {
  displayModeStandalone: boolean;
  iosNavigatorStandalone: boolean;
  iosLike: boolean;
  promptAvailable: boolean;
}): InstallState {
  if (capability.displayModeStandalone || capability.iosNavigatorStandalone) {
    return "INSTALLED";
  }
  if (capability.promptAvailable) return "PROMPT_AVAILABLE";
  if (capability.iosLike) return "IOS_MANUAL";
  return "UNAVAILABLE";
}

export function detectIosLikePlatform(platform: {
  maxTouchPoints: number;
  platform: string;
  userAgent: string;
}): boolean {
  const iosIdentifier = /iPad|iPhone|iPod/i;
  return (
    iosIdentifier.test(platform.userAgent) ||
    iosIdentifier.test(platform.platform) ||
    (platform.platform === "MacIntel" && platform.maxTouchPoints > 1)
  );
}
