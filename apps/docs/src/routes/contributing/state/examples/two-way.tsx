import { component$, useSignal, useStylesScoped$ } from "@qwik.dev/core";

export default component$(() => {
  useStylesScoped$(styles);
  const myTextSignal = useSignal("Hello");
  return (
    <>
      <input bind:value={myTextSignal} />
      <p>{myTextSignal.value}</p>
    </>
  );
});

import styles from "./two-way.css?inline";
