const controllerProfiles = [
  {
    value: "BE-DEFENCE-ADMIN",
    label: "Defence administration",
    detail: "Non-classified administrative security pilot",
  },
  {
    value: "BE-ARMED-FORCES-OPS",
    label: "Armed forces operations",
    detail: "Requires a separately accredited topology",
  },
  {
    value: "BE-INTEL",
    label: "Intelligence service",
    detail: "No public SaaS implementation is authorized",
  },
  {
    value: "BE-POLICE",
    label: "Integrated police",
    detail: "Separate police purpose, controls and oversight",
  },
  {
    value: "BE-MUNICIPAL",
    label: "Municipality",
    detail: "Documented local authority and camera procedure",
  },
] as const;

export function SetupForm() {
  return (
    <form className="setup-form">
      <fieldset>
        <legend>
          <span>01</span>
          <div>
            <strong>Organization and deployment</strong>
            <p>
              Name the accountable boundary—never a shared Belgian-state tenant.
            </p>
          </div>
        </legend>
        <div className="setup-field-grid">
          <label>
            <span>Organization name</span>
            <input
              name="organizationName"
              placeholder="Accountable public authority"
              type="text"
            />
          </label>
          <label>
            <span>Deployment label</span>
            <input
              name="deploymentLabel"
              placeholder="e.g. Administrative entrance pilot"
              type="text"
            />
          </label>
        </div>
        <label>
          <span>Intended purpose</span>
          <textarea
            name="purposeSummary"
            placeholder="Describe the exact authorized objective, capture context and intended outcome."
            rows={4}
          />
          <small>Purpose changes create a new approval boundary.</small>
        </label>
      </fieldset>

      <fieldset>
        <legend>
          <span>02</span>
          <div>
            <strong>Controller profile</strong>
            <p>The profile routes legal, hosting and capability controls.</p>
          </div>
        </legend>
        <div className="controller-options">
          {controllerProfiles.map((profile) => (
            <label key={profile.value}>
              <input
                name="controllerProfile"
                type="radio"
                value={profile.value}
              />
              <span>
                <strong>{profile.label}</strong>
                <small>{profile.detail}</small>
              </span>
              <code>{profile.value}</code>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span>03</span>
          <div>
            <strong>Baseline capabilities</strong>
            <p>
              Requests are still subject to model, policy and deployment
              approval.
            </p>
          </div>
        </legend>
        <div className="capability-options">
          <label>
            <input name="requestedCapabilities" type="checkbox" value="ALPR" />
            <span>
              <strong>ALPR</strong>
              <small>Vehicle plate candidates and context</small>
            </span>
          </label>
          <label>
            <input
              name="requestedCapabilities"
              type="checkbox"
              value="OBJECT_DETECTION"
            />
            <span>
              <strong>Object detection</strong>
              <small>Approved non-identifying object categories</small>
            </span>
          </label>
          <div className="blocked-capability">
            <span>Biometric identification</span>
            <strong>Separate authority required</strong>
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span>04</span>
          <div>
            <strong>Classification boundary</strong>
            <p>
              Public SaaS is not a universal government operational data plane.
            </p>
          </div>
        </legend>
        <label className="setup-acknowledgement">
          <input name="acknowledgesClassificationBoundary" type="checkbox" />
          <span>
            I acknowledge that classified, intelligence, police-investigation
            and military-operational data cannot enter this Vercel/Supabase
            topology without separate accreditation and controller approval.
          </span>
        </label>
      </fieldset>

      <div className="setup-submit-area">
        <div>
          <strong>Persistence is not provisioned</strong>
          <p>Inputs on this page are not submitted or stored.</p>
        </div>
        <button className="button sentry-disabled" disabled type="button">
          Storage required
        </button>
      </div>
    </form>
  );
}
