import {
  type PropsOf,
  Slot,
  component$,
  sync$,
  useContext,
  useOnWindow,
  useTask$
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type RadioGroupDescriptionProps = PropsOf<"div">;

/** A description component for the radio group that provides additional context */
export const RadioGroupDescription = component$((props: RadioGroupDescriptionProps) => {
  const context = useContext(radioGroupContextId);
  const descriptionId = `${context.localId}-description`;

  useTask$(() => {
    if (!context.isDescription) {
      console.warn(
        "Qwik Design System Warning: No description prop provided to the Radio Group Root component."
      );
    }
  });

  return (
    // Identifier for the radio group description element
    <div id={descriptionId} data-qds-checkbox-description {...props}>
      <Slot />
    </div>
  );
});
