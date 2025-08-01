import { component$, useSignal, useTask$ } from "@qwik.dev/core";

export default component$(() => {
  const order = useSignal("");

  useTask$(() => {
    order.value += "Task 1, ";
  });

  useTask$(() => {
    order.value += "Task 2, ";
  });

  useTask$(() => {
    order.value += "Task 3";
  });

  return <div>{order.value}</div>;
});
