import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicDescriptionProps = PropsOf<"div">;

export const RadioGroupDescription = component$((props: PublicDescriptionProps) => {
  const context = useContext(radioGroupContextId);
  const descriptionId = `${context.localId}-description`;

  return (
    <Render {...props} id={descriptionId} data-qds-radio-group-description fallback="div">
      <Slot />
    </Render>
  );
});
