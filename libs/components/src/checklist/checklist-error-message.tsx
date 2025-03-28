import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxErrorMessageBase } from "../checkbox/checkbox-error-message";

export const ChecklistErrorMessage = component$(
  (props: PropsOf<typeof CheckboxErrorMessageBase>) => {
    return (
      <CheckboxErrorMessageBase {...props}>
        <Slot />
      </CheckboxErrorMessageBase>
    );
  }
);
