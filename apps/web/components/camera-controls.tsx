import type { CameraDeviceOption, CameraState } from "../lib/camera/session";

type CameraStatusCopy = Readonly<{ label: string; detail: string }>;

export function CameraControls({
  backendConfigured,
  cameraDevices,
  captureZoneAcknowledged,
  copy,
  onCameraChange,
  onCaptureZoneChange,
  onEnable,
  onStop,
  selectedDeviceId,
  state,
}: {
  backendConfigured: boolean;
  cameraDevices: ReadonlyArray<CameraDeviceOption>;
  captureZoneAcknowledged: boolean;
  copy: CameraStatusCopy;
  onCameraChange(deviceId: string): void;
  onCaptureZoneChange(acknowledged: boolean): void;
  onEnable(): void;
  onStop(): void;
  selectedDeviceId: string;
  state: CameraState | "CHECKING";
}) {
  const canEnable = ["IDLE", "DENIED", "INTERRUPTED", "STOPPED"].includes(
    state,
  );
  const previewing = state === "PREVIEWING";

  return (
    <aside className="sentry-controls">
      <div className="sentry-status-heading" aria-live="polite">
        <span className="kicker">Camera session</span>
        <h2>{copy.label}</h2>
        <p>{copy.detail}</p>
      </div>

      {previewing && cameraDevices.length > 1 ? (
        <div className="camera-field">
          <label htmlFor="camera-device">Camera</label>
          <select
            id="camera-device"
            onChange={(event) => onCameraChange(event.target.value)}
            value={selectedDeviceId}
          >
            {cameraDevices.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
          <p>Available cameras appear only after browser permission.</p>
        </div>
      ) : null}

      <label className="capture-zone-control">
        <input
          checked={captureZoneAcknowledged}
          disabled={!previewing}
          onChange={(event) => onCaptureZoneChange(event.target.checked)}
          type="checkbox"
        />
        <span>
          <strong>Authorized capture zone</strong>
          <small>
            I confirm this visible session is positioned within an approved
            capture zone. This confirmation is not stored yet.
          </small>
        </span>
      </label>

      <div className="camera-actions">
        {previewing ? (
          <button
            className="button button-secondary"
            onClick={onStop}
            type="button"
          >
            Stop camera
          </button>
        ) : (
          <button
            className="button button-primary"
            disabled={!canEnable}
            onClick={onEnable}
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
          <dd className={previewing ? "diagnostic-ready" : ""}>{copy.label}</dd>
        </div>
        <div>
          <dt>Capture zone</dt>
          <dd className={captureZoneAcknowledged ? "diagnostic-ready" : ""}>
            {captureZoneAcknowledged
              ? "Confirmed for session"
              : "Not confirmed"}
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
  );
}
