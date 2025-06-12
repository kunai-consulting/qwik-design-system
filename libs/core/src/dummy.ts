import type { ReactivityAdapter } from "./adapter";

export function useDummy(_, runtime: ReactivityAdapter) {
  const r = runtime;

  const firstNameSig = r.signal("John");
  const lastNameSig = r.signal("Doe");

  const exampleComputedSig = r.computed(() => {
    return `${firstNameSig.value} ${lastNameSig.value}`;
  });

  r.task(({ track, cleanup }) => {
    track(() => firstNameSig.value);

    console.log(`exampleComputedSig: ${exampleComputedSig.value}`);

    cleanup(() => {
      console.log("cleanup");
    });
  });
}
