import { component$, useSignal, useTask$ } from "@builder.io/qwik";

export default component$(() => {
  const signal = useSignal("");

  useTask$(() => {
    signal.value = "Hello World";
  });

  return <div>{signal.value}</div>;
});
