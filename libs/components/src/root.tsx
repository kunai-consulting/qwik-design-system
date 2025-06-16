import { component$, useComputedQrl, useSignal, useTaskQrl } from "@builder.io/qwik";
import { createReactivityAdapter } from "../../../libs/core/src/adapter";
import { useDummy } from "../../../libs/core/src/dummy";

export default component$(() => {
  const adapter = createReactivityAdapter("qwik", {
    signal: useSignal,
    computed: useComputedQrl,
    task: useTaskQrl
  });

  const { firstNameSig, lastNameSig, ageSig, fullNameSig, isAdultSig } = useDummy(
    null,
    adapter
  );

  return (
    <>
      <head>
        <meta charset="utf-8" />
        <title>Qwik Reactivity Demo</title>
      </head>
      <body>
        <div style={{ padding: "20px" }}>
          <h1>Reactivity Demo</h1>

          <div style={{ marginBottom: "20px" }}>
            <h2>User Info</h2>
            <div style={{ marginBottom: "10px" }}>
              <label>
                First Name:
                <input
                  type="text"
                  value={firstNameSig.value}
                  onInput$={(e) =>
                    (firstNameSig.value = (e.target as HTMLInputElement).value)
                  }
                />
              </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                Last Name:
                <input
                  type="text"
                  value={lastNameSig.value}
                  onInput$={(e) =>
                    (lastNameSig.value = (e.target as HTMLInputElement).value)
                  }
                />
              </label>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                Age:
                <input
                  type="number"
                  value={ageSig.value}
                  onInput$={(e) =>
                    (ageSig.value =
                      Number.parseInt((e.target as HTMLInputElement).value) || 0)
                  }
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
      </body>
    </>
  );
});
