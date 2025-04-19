import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxIndicatorBase } from "../checkbox/checkbox-indicator";

export const ChecklistItemIndicator = component$(
  (props: PropsOf<typeof CheckboxIndicatorBase>) => {
    return (
      <CheckboxIndicatorBase {...props}>
        <Slot />
      </CheckboxIndicatorBase>
    );
  }
);
