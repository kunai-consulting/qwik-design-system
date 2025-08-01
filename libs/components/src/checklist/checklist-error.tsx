import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxError } from "../checkbox/checkbox-error";

export const ChecklistError = component$((props: PropsOf<typeof CheckboxError>) => {
  return (
    <CheckboxError {...props}>
      <Slot />
    </CheckboxError>
  );
});
