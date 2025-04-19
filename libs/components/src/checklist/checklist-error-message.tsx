import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
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
