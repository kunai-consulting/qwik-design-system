import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { CheckboxDescriptionBase } from "../checkbox/checkbox-description";

export const ChecklistItemDescription = component$(
  (props: PropsOf<typeof CheckboxDescriptionBase>) => {
    return (
      <CheckboxDescriptionBase {...props}>
        <Slot />
      </CheckboxDescriptionBase>
    );
  }
);
