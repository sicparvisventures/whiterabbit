import { describe, expect, it, vi } from "vitest";

import {
  getInitialCameraState,
  reduceCameraState,
  stopMediaStream,
} from "./session";

describe("getInitialCameraState", () => {
  it("reports unsupported media APIs", () => {
    expect(
      getInitialCameraState({
        secureContext: true,
        mediaDevicesAvailable: false,
      }),
    ).toBe("UNSUPPORTED");
  });

  it("requires a secure context", () => {
    expect(
      getInitialCameraState({
        secureContext: false,
        mediaDevicesAvailable: true,
      }),
    ).toBe("INSECURE");
  });

  it("starts idle only when the camera API is available securely", () => {
    expect(
      getInitialCameraState({
        secureContext: true,
        mediaDevicesAvailable: true,
      }),
    ).toBe("IDLE");
  });
});

describe("reduceCameraState", () => {
  it("moves through explicit request, preview and stop states", () => {
    expect(reduceCameraState("IDLE", "REQUEST")).toBe("REQUESTING");
    expect(reduceCameraState("REQUESTING", "GRANTED")).toBe("PREVIEWING");
    expect(reduceCameraState("PREVIEWING", "STOP")).toBe("STOPPED");
  });

  it("interrupts an active preview when the document is hidden", () => {
    expect(reduceCameraState("PREVIEWING", "HIDDEN")).toBe("INTERRUPTED");
  });

  it("does not let an invalid event manufacture a preview", () => {
    expect(reduceCameraState("IDLE", "GRANTED")).toBe("IDLE");
  });
});

describe("stopMediaStream", () => {
  it("stops every track", () => {
    const first = { stop: vi.fn() };
    const second = { stop: vi.fn() };

    stopMediaStream({ getTracks: () => [first, second] });

    expect(first.stop).toHaveBeenCalledOnce();
    expect(second.stop).toHaveBeenCalledOnce();
  });
});
