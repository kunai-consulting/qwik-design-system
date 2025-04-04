import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicDescriptionProps = PropsOf<"div">;

export const RadioGroupDescriptionBase = component$((props: PublicDescriptionProps) => {
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

export const RadioGroupDescription = withAsChild(RadioGroupDescriptionBase);
