import { type PropsOf, Slot, component$, useContext, useTask$ } from "@qwik.dev/core";
import { Render } from "../render/render";
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
    <Render {...props} id={descriptionId} data-qds-radio-group-description fallback="div">
      <Slot />
    </Render>
  );
});
