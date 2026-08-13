"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  buildVideoConstraints,
  getInitialCameraState,
  listCameraDevices,
  reduceCameraState,
  stopMediaStream,
  type CameraDeviceOption,
  type CameraState,
} from "../lib/camera/session";
import { CameraControls } from "./camera-controls";

const stateCopy: Record<
  CameraState | "CHECKING",
  { label: string; detail: string }
> = {
  CHECKING: {
    label: "Checking browser",
    detail: "Inspecting local camera support.",
  },
  UNSUPPORTED: {
    label: "Camera unavailable",
    detail: "This browser has no compatible media API.",
  },
  INSECURE: {
    label: "HTTPS required",
    detail: "Open WhiteRabbit in a secure browser context.",
  },
  IDLE: { label: "Camera off", detail: "Permission has not been requested." },
  REQUESTING: {
    label: "Permission requested",
    detail: "Respond to the browser camera prompt.",
  },
  PREVIEWING: {
    label: "Local preview active",
    detail: "Frames remain inside this browser session.",
  },
  DENIED: {
    label: "Permission denied",
    detail: "Allow camera access in browser settings and retry.",
  },
  INTERRUPTED: {
    label: "Preview interrupted",
    detail: "The camera stopped when the page became hidden.",
  },
  STOPPED: {
    label: "Camera stopped",
    detail: "All media tracks have been released.",
  },
};

export function CameraSentry({
  backendConfigured,
}: {
  backendConfigured: boolean;
}) {
  const [state, setState] = useState<CameraState | "CHECKING">("CHECKING");
  const [cameraDevices, setCameraDevices] = useState<CameraDeviceOption[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [captureZoneAcknowledged, setCaptureZoneAcknowledged] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);

  const releaseStream = useCallback((event: "STOP" | "HIDDEN") => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCaptureZoneAcknowledged(false);
    setState((current) =>
      current === "CHECKING" ? current : reduceCameraState(current, event),
    );
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    setState(
      getInitialCameraState({
        secureContext: window.isSecureContext,
        mediaDevicesAvailable: Boolean(navigator.mediaDevices?.getUserMedia),
      }),
    );

    function handleVisibilityChange() {
      if (document.hidden) releaseStream("HIDDEN");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      mountedRef.current = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    };
  }, [releaseStream]);

  async function enableCamera(deviceId?: string) {
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext)
      return;

    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCaptureZoneAcknowledged(false);
    setState("REQUESTING");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: buildVideoConstraints(deviceId),
      });

      if (!mountedRef.current || document.hidden) {
        stopMediaStream(stream);
        if (mountedRef.current) setState("INTERRUPTED");
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (
        !mountedRef.current ||
        document.hidden ||
        streamRef.current !== stream
      ) {
        stopMediaStream(stream);
        if (mountedRef.current) setState("INTERRUPTED");
        return;
      }

      setState("PREVIEWING");

      if (navigator.mediaDevices.enumerateDevices) {
        try {
          const devices = listCameraDevices(
            await navigator.mediaDevices.enumerateDevices(),
          );
          if (!mountedRef.current || streamRef.current !== stream) return;

          const activeDeviceId =
            stream.getVideoTracks()[0]?.getSettings().deviceId ??
            deviceId ??
            "";
          const selectedCamera = devices.find(
            (camera) => camera.deviceId === activeDeviceId,
          );

          setCameraDevices(devices);
          setSelectedDeviceId(
            selectedCamera?.deviceId ?? devices[0]?.deviceId ?? "",
          );
        } catch {
          setCameraDevices([]);
          setSelectedDeviceId("");
        }
      }
    } catch {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
      setState((current) =>
        current === "CHECKING"
          ? "DENIED"
          : reduceCameraState(current, "DENIED"),
      );
    }
  }

  const copy = stateCopy[state];

  return (
    <div className="sentry-grid">
      <section className="camera-stage" aria-label="Local camera preview">
        <video muted playsInline ref={videoRef} />
        {state !== "PREVIEWING" && (
          <div className="camera-placeholder">
            <span className="camera-reticle" aria-hidden="true" />
            <strong>{copy.label}</strong>
            <p>{copy.detail}</p>
          </div>
        )}
        <div className="camera-stage-labels">
          <span>LOCAL PREVIEW</span>
          <span>{state}</span>
        </div>
      </section>

      <CameraControls
        backendConfigured={backendConfigured}
        cameraDevices={cameraDevices}
        captureZoneAcknowledged={captureZoneAcknowledged}
        copy={copy}
        onCameraChange={(deviceId) => void enableCamera(deviceId)}
        onCaptureZoneChange={setCaptureZoneAcknowledged}
        onEnable={() => void enableCamera()}
        onStop={() => releaseStream("STOP")}
        selectedDeviceId={selectedDeviceId}
        state={state}
      />
    </div>
  );
}
