import { type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

type ToastDescriptionProps = HTMLElementAttrs<"div">;

export const ToastDescriptionBase = component$((props: ToastDescriptionProps) => {
  const context = useContext(toastContextId);

  return (
    <Render
      fallback="div"
      id={context.descriptionId}
      data-qds-toast-description
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const ToastDescription = withAsChild(ToastDescriptionBase);
