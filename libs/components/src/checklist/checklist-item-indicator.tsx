import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
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
