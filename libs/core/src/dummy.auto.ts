import { type ReactivityAdapter, useRuntime } from "./adapter";
import { useBinding } from "./bindings";

export function useDummy(runtime: ReactivityAdapter, props: Record<string, any> = {}) {
  const use = useRuntime(runtime);
  // making changes to favoriteColorSig will update the input value
  const favoriteColorSig = useBinding("blue", use, props?.["bind:favoriteColor"]);
  // the below line doesn't work. needs troubleshooting
  // const favoriteColorSig = use.boundSignal(props?.["bind:favoriteColor"], "blue");

  const firstNameSig = use.signal("Jay");
  const lastNameSig = use.signal("Doe");
  const ageSig = use.signal(25);

  const fullNameFn = use.fn(() => {
    return `${firstNameSig.value} ${lastNameSig.value}`;
  });

  // to reference the function, we need to do use.fn(() => { ... }) for compilers to work
  const fullNameSig = use.computed(fullNameFn);

  const isAdultSig = use.computed(() => {
    return ageSig.value >= 18;
  });

  use.task(({ track, cleanup }) => {
    track(() => firstNameSig.value);
    track(() => lastNameSig.value);
    track(() => ageSig.value);
    track(() => favoriteColorSig.value);

    cleanup(() => {
      console.log("Cleaning up previous effect");
    });
  });
  console.log("=== Tracked Changes ===");
  console.log(`Full Name: ${fullNameSig.value}`);
  console.log(`Age: ${ageSig.value}`);
  console.log(`Is Adult: ${isAdultSig.value}`);
  console.log(`Favorite Color: ${favoriteColorSig.value}`);
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
    isAdultSig,
    favoriteColorSig
  };
}
