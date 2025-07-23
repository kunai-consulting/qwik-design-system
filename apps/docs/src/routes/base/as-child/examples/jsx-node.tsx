import { type HTMLElementAttrs, Slot, component$ } from "@qwik.dev/core";
import { Render, withAsChild } from "@kunai-consulting/qwik";

const DummyCompBase = component$((props: HTMLElementAttrs<"div">) => {
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
