import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export const ToastTitleBase = component$((props: PropsOf<"div">) => {
  const context = useContext(toastContextId);
  const titleId = `${context.localId}-title`;

  return (
    <Render id={titleId} data-qds-toast-title fallback="div" {...props}>
      <Slot />
    </Render>
  );
});

export const ToastTitle = withAsChild(ToastTitleBase);
