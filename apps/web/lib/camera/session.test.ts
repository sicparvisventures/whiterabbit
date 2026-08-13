import { describe, expect, it, vi } from "vitest";

import {
  buildVideoConstraints,
  getInitialCameraState,
  listCameraDevices,
  reduceCameraState,
  stopMediaStream,
} from "./session";

describe("buildVideoConstraints", () => {
  it("prefers the environment camera before a device is selected", () => {
    expect(buildVideoConstraints()).toEqual({
      facingMode: { ideal: "environment" },
    });
  });

  it("requests only the exact camera selected by the operator", () => {
    expect(buildVideoConstraints("rear-camera")).toEqual({
      deviceId: { exact: "rear-camera" },
    });
  });
});

describe("listCameraDevices", () => {
  it("returns only selectable video inputs with permission-safe labels", () => {
    expect(
      listCameraDevices([
        { deviceId: "front-camera", kind: "videoinput", label: "Front" },
        { deviceId: "microphone", kind: "audioinput", label: "Mic" },
        { deviceId: "rear-camera", kind: "videoinput", label: "" },
      ]),
    ).toEqual([
      { deviceId: "front-camera", label: "Front" },
      { deviceId: "rear-camera", label: "Camera 2" },
    ]);
  });

  it("drops unavailable and duplicate device identifiers", () => {
    expect(
      listCameraDevices([
        { deviceId: "", kind: "videoinput", label: "Unavailable" },
        { deviceId: "same", kind: "videoinput", label: "First" },
        { deviceId: "same", kind: "videoinput", label: "Duplicate" },
      ]),
    ).toEqual([{ deviceId: "same", label: "First" }]);
  });
});

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
