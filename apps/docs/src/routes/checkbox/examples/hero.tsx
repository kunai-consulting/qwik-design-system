import {
  component$,
  PropsOf,
  Slot,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik";

export const MyComp = component$((props: PropsOf<"button">) => {
  const testSig = useSignal(false);

  useTask$(({ track }) => {
    track(() => testSig.value);

    console.log("test sig: ", testSig.value);
  });

  return (
    <button data-some-attr {...props}>
      <Slot />
    </button>
  );
});

export default component$(() => {
  useStyles$(styles);

  return (
    <Checkbox.Root>
      <Checkbox.Trigger class="checkbox-trigger" asChild>
        <MyComp>
          <Checkbox.Indicator class="checkbox-indicator">
            <LuCheck />
          </Checkbox.Indicator>
        </MyComp>
      </Checkbox.Trigger>
    </Checkbox.Root>
  );
});

import { LuCheck } from "@qwikest/icons/lucide";
// example styles
import styles from "./checkbox.css?inline";
