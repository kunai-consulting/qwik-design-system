import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export const ToastDescriptionBase = component$((props: PropsOf<"div">) => {
  const context = useContext(toastContextId);
  const descriptionId = `${context.localId}-description`;

  return (
    <Render
      id={descriptionId}
      data-qds-toast-description
      fallback="div"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const ToastDescription = withAsChild(ToastDescriptionBase); 