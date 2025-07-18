import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

type ToastCloseProps = PropsOf<"button">;

export const ToastCloseBase = component$((props: ToastCloseProps) => {
  const context = useContext(toastContextId);

  const handleClick$ = $(() => {
    context.isOpenSig.value = false;
  });

  return (
    <Render
      fallback="button"
      type="button"
      aria-label="Close"
      data-qds-toast-close
      onClick$={[handleClick$, props.onClick$]}
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const ToastClose = withAsChild(ToastCloseBase);
