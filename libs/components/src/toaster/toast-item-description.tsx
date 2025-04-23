import { Slot, component$, type PropsOf } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type ToastItemDescriptionProps = PropsOf<"div">;

const ToastItemDescriptionBase = component$<ToastItemDescriptionProps>((props) => {
  return (
    <Render fallback="div" data-toast-description {...props}>
      <Slot />
    </Render>
  );
});

export const ToastItemDescription = withAsChild(ToastItemDescriptionBase);
