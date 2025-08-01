import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxTrigger } from "../checkbox/checkbox-trigger";

export const ChecklistItemTrigger = component$(
  (props: PropsOf<typeof CheckboxTrigger>) => {
    return (
      <CheckboxTrigger {...props}>
        <Slot />
      </CheckboxTrigger>
    );
  }
);
