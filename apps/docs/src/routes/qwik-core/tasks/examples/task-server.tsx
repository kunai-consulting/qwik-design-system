import { component$, useSignal, useTask$ } from "@qwik.dev/core";

export default component$(() => {
  const signal = useSignal("");

  useTask$(() => {
    signal.value = "Hello World";
  });

  return <div>{signal.value}</div>;
});
