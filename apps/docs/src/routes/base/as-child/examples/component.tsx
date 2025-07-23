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

const AsChildComp = component$((props: HTMLElementAttrs<"span">) => {
  return (
    <span {...props} data-inside-comp>
      Hello
    </span>
  );
});

export default component$(() => {
  return (
    <DummyComp asChild data-outside-comp>
      <AsChildComp>Hello</AsChildComp>
    </DummyComp>
  );
});
