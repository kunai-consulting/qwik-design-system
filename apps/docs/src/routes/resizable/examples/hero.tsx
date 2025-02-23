import { component$ } from "@builder.io/qwik";
import { Resizable } from "@kunai-consulting/qwik";

export default component$(() => {
  return <Resizable.Root orientation="horizontal"></Resizable.Root>;
});
