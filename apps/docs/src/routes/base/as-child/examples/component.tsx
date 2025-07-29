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

const AsChildComp = component$((props: PropsOf<"span">) => {
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
