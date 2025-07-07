import { type ReactivityAdapter, useRuntime } from "./adapter";

export function useDummy(_: unknown, runtime: ReactivityAdapter) {
  const use = useRuntime(runtime);

  const firstNameSig = use.signal("Jay");
  const lastNameSig = use.signal("Doe");
  const ageSig = use.signal(25);
  const ageStringSig = use.computed(() => String(ageSig.value));
  const values = use.bindings([firstNameSig, lastNameSig, ageStringSig]);

  const fullNameFn = use.fn(() => {
    return `${firstNameSig.value} ${lastNameSig.value}`;
  });

  console.log("fullNameFn", fullNameFn);

  // to reference the function, we need to do use.fn(() => { ... }) for compilers to work
  const fullNameSig = use.computed(fullNameFn);

  const isAdultSig = use.computed(() => {
    return ageSig.value >= 18;
  });

  use.task(({ track, cleanup }) => {
    track(() => firstNameSig.value);
    track(() => lastNameSig.value);
    track(() => ageSig.value);
    track(() => values);

    cleanup(() => {
      console.log("Cleaning up previous effect");
    });
  });
  console.log("=== Tracked Changes ===");
  console.log(`Full Name: ${fullNameSig.value}`);
  console.log(`Age: ${ageSig.value}`);
  console.log(`Is Adult: ${isAdultSig.value}`);
  console.log(`Values: ${JSON.stringify(values)}`);
  console.log("=====================");

  use.task(({ track, cleanup }) => {
    track(() => ageSig.value);

    if (ageSig.value >= 18) {
      console.log("User is now an adult!");
    } else {
      console.log("User is a minor");
    }

    cleanup(() => {
      console.log("Age tracking cleanup");
    });
  });

  return {
    firstNameSig,
    lastNameSig,
    ageSig,
    fullNameSig,
    isAdultSig
  };
}
