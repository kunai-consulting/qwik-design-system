import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxIndicator } from "../checkbox/checkbox-indicator";

export const ChecklistItemIndicator = component$(
  (props: PropsOf<typeof CheckboxIndicator>) => {
    return (
      <CheckboxIndicator {...props}>
        <Slot />
      </CheckboxIndicator>
    );
  }
);
