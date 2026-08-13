"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getInitialCameraState,
  reduceCameraState,
  stopMediaStream,
  type CameraState,
} from "../lib/camera/session";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);

  const releaseStream = useCallback((event: "STOP" | "HIDDEN") => {
    stopMediaStream(streamRef.current);
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
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

  async function enableCamera() {
    if (!navigator.mediaDevices?.getUserMedia || !window.isSecureContext)
      return;

    setState((current) =>
      current === "CHECKING" ? current : reduceCameraState(current, "REQUEST"),
    );

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
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
      setState((current) =>
        current === "CHECKING"
          ? current
          : reduceCameraState(current, "GRANTED"),
      );
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
  const canEnable = ["IDLE", "DENIED", "INTERRUPTED", "STOPPED"].includes(
    state,
  );

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

      <aside className="sentry-controls">
        <div className="sentry-status-heading">
          <span className="kicker">Camera session</span>
          <h2>{copy.label}</h2>
          <p>{copy.detail}</p>
        </div>

        <div className="camera-actions">
          {state === "PREVIEWING" ? (
            <button
              className="button button-secondary"
              onClick={() => releaseStream("STOP")}
              type="button"
            >
              Stop camera
            </button>
          ) : (
            <button
              className="button button-primary"
              disabled={!canEnable}
              onClick={enableCamera}
              type="button"
            >
              {state === "REQUESTING" ? "Requesting…" : "Enable camera"}
            </button>
          )}
          <button className="button sentry-disabled" disabled type="button">
            Start detection
          </button>
        </div>

        <dl className="sentry-diagnostics">
          <div>
            <dt>Browser camera</dt>
            <dd className={state === "PREVIEWING" ? "diagnostic-ready" : ""}>
              {copy.label}
            </dd>
          </div>
          <div>
            <dt>Backend</dt>
            <dd className={backendConfigured ? "diagnostic-ready" : ""}>
              {backendConfigured ? "Configured" : "Not connected"}
            </dd>
          </div>
          <div>
            <dt>Node identity</dt>
            <dd>Not enrolled</dd>
          </div>
          <div>
            <dt>Effective policy</dt>
            <dd>Not approved</dd>
          </div>
          <div>
            <dt>Detection model</dt>
            <dd>Not installed</dd>
          </div>
        </dl>

        <div className="privacy-note">
          <strong>Preview is not detection</strong>
          <p>
            This page does not upload frames or claim ALPR, object or biometric
            results. Detection stays locked until every readiness gate is real.
          </p>
        </div>
      </aside>
    </div>
  );
}
