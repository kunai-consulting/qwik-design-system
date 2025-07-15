import "./App.css";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { createReactivityAdapter } from "../../../libs/core/src/adapter";
import { useDummy } from "../../../libs/core/src/dummy.auto";
import { useSignals } from "@preact/signals-react/runtime";

function App() {
  const adapter = createReactivityAdapter("react", {
    signal: useSignal,
    computed: useComputed,
    task: useSignalEffect,
    fn: (fn) => fn
  });
  useSignals();

  const { firstNameSig, lastNameSig, ageSig, fullNameSig, isAdultSig, favoriteColorSig } =
    useDummy(adapter);

  const countSig = useSignal(0);

  useSignalEffect(() => {
    console.log("isAdultSig", countSig.value);
    console.log("isOver10", isOver10.value);
    console.log("favoriteColor object:", favoriteColorSig);
    console.log("Favorite Color:", favoriteColorSig.value);
  });

  const isOver10 = useComputed(() => {
    return countSig.value > 10;
  });

  const bindings = { favoriteColorSig: favoriteColorSig.value };

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
        <div style={{ marginBottom: "10px" }}>
          <label>
            Color:
            <input
              type="text"
              value={favoriteColorSig.value}
              onChange={(e) => (favoriteColorSig.value = e.target.value)}
            />
          </label>
          <div>
            <button onClick={() => (favoriteColorSig.value = "blue")} type="button">
              default
            </button>
            <button onClick={() => (favoriteColorSig.value = "red")} type="button">
              red
            </button>
            <button onClick={() => (favoriteColorSig.value = "green")} type="button">
              green
            </button>
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Computed Values:</h3>
          <p>Full Name: {fullNameSig.value}</p>
          <p>Is Adult: {isAdultSig.value ? "Yes" : "No"}</p>
          <div style={{ textAlign: "left", paddingLeft: "120px" }}>
            <div>Bindings:</div>
            {Object.entries(bindings).map(([key, val]) => (
              <div key={key}>
                {key}: {String(val)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
