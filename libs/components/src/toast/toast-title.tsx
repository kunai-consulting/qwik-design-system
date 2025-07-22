import { type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

type ToastTitleProps = PropsOf<"span">;

export const ToastTitleBase = component$((props: ToastTitleProps) => {
  const context = useContext(toastContextId);

  return (
    <Render fallback="span" id={context.titleId} data-qds-toast-title {...props}>
      <Slot />
    </Render>
  );
});

export const ToastTitle = withAsChild(ToastTitleBase);
