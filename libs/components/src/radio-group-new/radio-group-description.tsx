import {
  component$,
  useContext,
  type PropsOf,
  Slot,
  useTask$
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicDescriptionProps = PropsOf<"div">;

export const RadioGroupDescription = component$((props: PublicDescriptionProps) => {
  const context = useContext(radioGroupContextId);
  const descriptionId = `${context.localId}-description`;

  useTask$(() => {
    if (!context.isDescription) {
      console.warn(
        "Radio Group Warning: isDescription prop is not provided to the Root component"
      );
    }
  });

  return (
    <div
      {...props}
      id={descriptionId}
      data-qds-radio-group-description
    >
      <Slot />
    </div>
  );
});
