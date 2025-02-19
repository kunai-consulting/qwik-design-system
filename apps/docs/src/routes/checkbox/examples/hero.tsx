import {
  component$,
  PropsOf,
  Slot,
  useSignal,
  useStyles$,
  useTask$,
} from "@builder.io/qwik";
import { Checkbox } from "@kunai-consulting/qwik";

export const MyComp = component$((props: PropsOf<"div">) => {
  return (
    <div data-some-attr {...props}>
      <Slot />
    </div>
  );
});

export default component$(() => {
  useStyles$(styles);
  const testSig = useSignal(false);

  useTask$(({ track }) => {
    track(() => testSig.value);

    console.log("test sig: ", testSig.value);
  });

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
