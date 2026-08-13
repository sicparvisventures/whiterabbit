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

export type CameraDeviceOption = Readonly<{
  deviceId: string;
  label: string;
}>;

type CameraDeviceDescriptor = Readonly<{
  deviceId: string;
  kind: string;
  label: string;
}>;

export function buildVideoConstraints(
  selectedDeviceId?: string,
): MediaTrackConstraints {
  return selectedDeviceId
    ? { deviceId: { exact: selectedDeviceId } }
    : { facingMode: { ideal: "environment" } };
}

export function listCameraDevices(
  devices: ReadonlyArray<CameraDeviceDescriptor>,
): CameraDeviceOption[] {
  const seen = new Set<string>();
  const cameras: CameraDeviceOption[] = [];

  for (const device of devices) {
    if (
      device.kind !== "videoinput" ||
      !device.deviceId ||
      seen.has(device.deviceId)
    ) {
      continue;
    }

    seen.add(device.deviceId);
    cameras.push({
      deviceId: device.deviceId,
      label: device.label.trim() || `Camera ${cameras.length + 1}`,
    });
  }

  return cameras;
}

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
