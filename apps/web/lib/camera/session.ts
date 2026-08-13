export type CameraState =
  | "UNSUPPORTED"
  | "INSECURE"
  | "IDLE"
  | "REQUESTING"
  | "PREVIEWING"
  | "DENIED"
  | "INTERRUPTED"
  | "STOPPED";

export type CameraEvent = "REQUEST" | "GRANTED" | "DENIED" | "HIDDEN" | "STOP";

export function getInitialCameraState(capability: {
  secureContext: boolean;
  mediaDevicesAvailable: boolean;
}): CameraState {
  if (!capability.mediaDevicesAvailable) return "UNSUPPORTED";
  if (!capability.secureContext) return "INSECURE";
  return "IDLE";
}

export function reduceCameraState(
  state: CameraState,
  event: CameraEvent,
): CameraState {
  if (
    event === "REQUEST" &&
    (state === "IDLE" ||
      state === "DENIED" ||
      state === "INTERRUPTED" ||
      state === "STOPPED")
  ) {
    return "REQUESTING";
  }

  if (state === "REQUESTING" && event === "GRANTED") return "PREVIEWING";
  if (state === "REQUESTING" && event === "DENIED") return "DENIED";
  if (state === "PREVIEWING" && event === "HIDDEN") return "INTERRUPTED";
  if (state === "PREVIEWING" && event === "STOP") return "STOPPED";

  return state;
}

type StoppableMediaStream = Readonly<{
  getTracks(): ReadonlyArray<{ stop(): void }>;
}>;

export function stopMediaStream(stream: StoppableMediaStream | null): void {
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
}
