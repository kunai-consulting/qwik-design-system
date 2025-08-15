import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { CheckboxTriggerBase } from "../checkbox/checkbox-trigger";

/** Clickable trigger component for individual checklist items */
export const ChecklistItemTrigger = component$(
  (props: PropsOf<typeof CheckboxTriggerBase>) => {
    return (
      <CheckboxTriggerBase {...props}>
        <Slot />
      </CheckboxTriggerBase>
    );
  }
);
