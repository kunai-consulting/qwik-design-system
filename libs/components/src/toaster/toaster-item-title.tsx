import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { ToastTitleBase } from "../toast/toast-title";

type ToasterItemTitleProps = PropsOf<typeof ToastTitleBase>;

export const ToasterItemTitleBase = component$((props: ToasterItemTitleProps) => {
  return (
    <ToastTitleBase {...props} data-qds-toaster-item-title>
      <Slot />
    </ToastTitleBase>
  );
});

export const ToasterItemTitle = withAsChild(ToasterItemTitleBase);
