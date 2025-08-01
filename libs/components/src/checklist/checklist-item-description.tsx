import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxDescription } from "../checkbox/checkbox-description";

export const ChecklistItemDescription = component$(
  (props: PropsOf<typeof CheckboxDescription>) => {
    return (
      <CheckboxDescription {...props}>
        <Slot />
      </CheckboxDescription>
    );
  }
);
