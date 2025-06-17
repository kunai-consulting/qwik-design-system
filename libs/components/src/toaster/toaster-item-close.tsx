import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { ToastCloseBase } from "../toast/toast-close";

type ToasterItemCloseProps = PropsOf<typeof ToastCloseBase>;

export const ToasterItemCloseBase = component$((props: ToasterItemCloseProps) => {
  return (
    <ToastCloseBase {...props} data-qds-toaster-item-close>
      <Slot />
    </ToastCloseBase>
  );
});

export const ToasterItemClose = withAsChild(ToasterItemCloseBase);
