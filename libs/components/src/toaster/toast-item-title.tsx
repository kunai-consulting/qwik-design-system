import { Slot, component$, type PropsOf } from "@builder.io/qwik";
import { Render } from "../render/render";
import { withAsChild } from "../as-child/as-child";

export type ToastItemTitleProps = PropsOf<"div">;

const ToastItemTitleBase = component$<ToastItemTitleProps>((props) => {
  return (
    <Render fallback="div" data-toast-title {...props}>
      <Slot />
    </Render>
  );
});

export const ToastItemTitle = withAsChild(ToastItemTitleBase);
