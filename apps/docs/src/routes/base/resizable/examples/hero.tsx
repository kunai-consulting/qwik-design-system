import { component$ } from "@qwik.dev/core";
import { Resizable } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Resizable.Root orientation="horizontal">
      <Resizable.Panel>Panel</Resizable.Panel>
      <Resizable.Handle>Handle</Resizable.Handle>
      <Resizable.Panel>Panel</Resizable.Panel>
    </Resizable.Root>
  );
});
