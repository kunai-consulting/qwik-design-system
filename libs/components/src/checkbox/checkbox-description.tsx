import {
  type PropsOf,
  Slot,
  component$,
  sync$,
  useContext,
  useOnWindow,
  useTask$
} from "@qwik.dev/core";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxDescriptionProps = PropsOf<"div">;
/** A component that renders the description text for a checkbox */
export const CheckboxDescription = component$((props: PublicCheckboxDescriptionProps) => {
  const context = useContext(checkboxContextId);
  const descriptionId = `${context.localId}-description`;
  useTask$(() => {
    if (!context.isDescription) {
      console.warn(
        "Qwik Design System Warning: No description prop provided to the Checkbox Root component."
      );
    }
  });
  return (
    // Identifier for the checkbox description element
    <div id={descriptionId} data-qds-checkbox-description {...props}>
      <Slot />
    </div>
  );
});
