import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxErrorBase } from "../checkbox/checkbox-error";

export const ChecklistError = component$((props: PropsOf<typeof CheckboxErrorBase>) => {
  return (
    <CheckboxErrorBase {...props}>
      <Slot />
    </CheckboxErrorBase>
  );
});
