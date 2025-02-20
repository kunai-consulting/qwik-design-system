import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { Checkbox } from "..";

export const ChecklistErrorMessage = component$(
  (props: PropsOf<typeof Checkbox.ErrorMessage>) => {
    return (
      <Checkbox.ErrorMessage {...props}>
        <Slot />
      </Checkbox.ErrorMessage>
    );
  }
);
