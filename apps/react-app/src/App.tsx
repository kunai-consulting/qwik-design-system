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

  const countSig = useSignal(0);

  useSignalEffect(() => {
    console.log("isAdultSig", countSig.value);

    console.log("isOver10", isOver10.value);
  });

  const isOver10 = useComputed(() => {
    return countSig.value > 10;
  });

  return (
    <div style={{ padding: "20px" }}>
      <button type="button" onClick={() => countSig.value++} data-hi={countSig.value}>
        Increment {countSig}
      </button>

      <p>Is over 10: {isOver10.value ? "Yes" : "No"}</p>

      <h1>Reactivity Demo</h1>

      <div style={{ marginBottom: "20px" }}>
        <h2>User Info</h2>
        <div style={{ marginBottom: "10px" }}>
          <label>
            First Name:
            <input
              type="text"
              value={firstNameSig.value}
              onChange={(e) => (firstNameSig.value = e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Last Name:
            <input
              type="text"
              value={lastNameSig.value}
              onChange={(e) => (lastNameSig.value = e.target.value)}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Age:
            <input
              type="number"
              value={ageSig.value}
              onChange={(e) => (ageSig.value = Number.parseInt(e.target.value) || 0)}
            />
          </label>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Computed Values:</h3>
          <p>Full Name: {fullNameSig.value}</p>
          <p>Is Adult: {isAdultSig.value ? "Yes" : "No"}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
