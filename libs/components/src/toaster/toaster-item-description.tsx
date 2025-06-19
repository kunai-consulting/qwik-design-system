import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { ToastDescriptionBase } from "../toast/toast-description";

type ToasterItemDescriptionProps = PropsOf<typeof ToastDescriptionBase>;

export const ToasterItemDescriptionBase = component$(
  (props: ToasterItemDescriptionProps) => {
    return (
      <ToastDescriptionBase {...props} data-qds-toaster-item-description>
        <Slot />
      </ToastDescriptionBase>
    );
  }
);

export const ToasterItemDescription = withAsChild(ToasterItemDescriptionBase);
