import { Render } from "@kunai-consulting/qwik";
import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

const DummyComp = component$((props: PropsOf<"div"> & { asChild?: boolean }) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export default component$(() => {
  return (
    <DummyComp asChild data-from-comp>
      <span data-on-span>Hello</span>
    </DummyComp>
  );
});
