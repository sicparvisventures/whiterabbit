import { describe, expect, it } from "vitest";

import { detectIosLikePlatform, resolveInstallState } from "./install-state";

describe("resolveInstallState", () => {
  it("treats either standalone signal as already installed", () => {
    expect(
      resolveInstallState({
        displayModeStandalone: true,
        iosNavigatorStandalone: false,
        iosLike: false,
        promptAvailable: true,
      }),
    ).toBe("INSTALLED");
  });

  it("prefers a real browser prompt when one is available", () => {
    expect(
      resolveInstallState({
        displayModeStandalone: false,
        iosNavigatorStandalone: false,
        iosLike: true,
        promptAvailable: true,
      }),
    ).toBe("PROMPT_AVAILABLE");
  });

  it("uses manual guidance only for an iOS-like browser without a prompt", () => {
    expect(
      resolveInstallState({
        displayModeStandalone: false,
        iosNavigatorStandalone: false,
        iosLike: true,
        promptAvailable: false,
      }),
    ).toBe("IOS_MANUAL");
  });

  it("does not invent an install action for other unsupported browsers", () => {
    expect(
      resolveInstallState({
        displayModeStandalone: false,
        iosNavigatorStandalone: false,
        iosLike: false,
        promptAvailable: false,
      }),
    ).toBe("UNAVAILABLE");
  });
});

describe("detectIosLikePlatform", () => {
  it("recognizes iPhone and iPad user agents", () => {
    expect(
      detectIosLikePlatform({
        maxTouchPoints: 0,
        platform: "iPhone",
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
      }),
    ).toBe(true);
  });

  it("recognizes touch iPads reporting a desktop Mac platform", () => {
    expect(
      detectIosLikePlatform({
        maxTouchPoints: 5,
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      }),
    ).toBe(true);
  });

  it("does not classify a non-touch Mac as iOS", () => {
    expect(
      detectIosLikePlatform({
        maxTouchPoints: 0,
        platform: "MacIntel",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      }),
    ).toBe(false);
  });
});
