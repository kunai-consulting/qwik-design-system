import { $, type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { toastContextId } from "./toast-context";

export const ToastCloseBase = component$((props: PropsOf<"button">) => {
  const context = useContext(toastContextId);
  
  const handleClick$ = $(() => {
    context.isOpenSig.value = false;
  });

  return (
    <Render
      onClick$={[handleClick$, props.onClick$]}
      aria-label={props["aria-label"] || "Close"}
      type="button"
      data-qds-toast-close
      fallback="button"
      {...props}
    >
      <Slot />
    </Render>
  );
});

export const ToastClose = withAsChild(ToastCloseBase); 