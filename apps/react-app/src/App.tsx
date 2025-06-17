import "./App.css";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { createReactivityAdapter } from "../../../libs/core/src/adapter";
import { useDummy } from "../../../libs/core/src/dummy.auto";

function App() {
  const adapter = createReactivityAdapter("react", {
    signal: useSignal,
    computed: useComputed,
    task: useSignalEffect
  });

  const { firstNameSig, lastNameSig, ageSig, fullNameSig, isAdultSig } = useDummy(
    null,
    adapter
  );

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reactivity Demo</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>User Info</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>
            First Name:
            <input
              type="text"
              value={firstNameSig}
              onChange={(e) => (firstNameSig.value = e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Last Name:
            <input
              type="text"
              value={lastNameSig}
              onChange={(e) => (lastNameSig.value = e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Age:
            <input
              type="number"
              value={ageSig}
              onChange={(e) => (ageSig.value = Number.parseInt(e.target.value) || 0)}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Computed Values:</h3>
          <p>Full Name: {fullNameSig}</p>
          <p>Is Adult: {isAdultSig ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
