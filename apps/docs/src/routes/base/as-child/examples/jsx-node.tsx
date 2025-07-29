import { Render, withAsChild } from "@kunai-consulting/qwik";
import { type PropsOf, Slot, component$ } from "@qwik.dev/core";

const DummyCompBase = component$((props: PropsOf<"div">) => {
  return (
    <Render fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

const DummyComp = withAsChild(DummyCompBase);

export default component$(() => {
  return (
    <DummyComp asChild data-from-comp>
      <span data-on-span>Hello</span>
    </DummyComp>
  );
});
