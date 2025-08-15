import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxErrorBase } from "../checkbox/checkbox-error";

/** Error message component for the checklist */
export const ChecklistError = component$((props: PropsOf<typeof CheckboxErrorBase>) => {
  return (
    <CheckboxErrorBase {...props}>
      <Slot />
    </CheckboxErrorBase>
  );
});
