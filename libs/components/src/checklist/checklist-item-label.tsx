import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxLabel } from "../checkbox/checkbox-label";

export const ChecklistItemLabel = component$((props: PropsOf<typeof CheckboxLabel>) => {
  return (
    <CheckboxLabel {...props}>
      <Slot />
    </CheckboxLabel>
  );
});
