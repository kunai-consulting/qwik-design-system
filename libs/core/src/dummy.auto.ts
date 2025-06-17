import type { ReactivityAdapter } from "./adapter";

export function useDummy(_, runtime: ReactivityAdapter) {
  const use = runtime;

  const firstNameSig = use.signal("John");
  const lastNameSig = use.signal("Doe");
  const ageSig = use.signal(25);

  const fullNameSig = use.computed(() => {
    return `${firstNameSig.value} ${lastNameSig.value}`;
  });

  const isAdultSig = use.computed(() => {
    return ageSig.value >= 18;
  });

  use.task(({ track, cleanup }) => {
    track(() => firstNameSig.value);
    track(() => lastNameSig.value);
    track(() => ageSig.value);

    console.log("=== Tracked Changes ===");
    console.log(`Full Name: ${fullNameSig.value}`);
    console.log(`Age: ${ageSig.value}`);
    console.log(`Is Adult: ${isAdultSig.value}`);
    console.log("=====================");

    cleanup(() => {
      console.log("Cleaning up previous effect");
    });
  });

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
