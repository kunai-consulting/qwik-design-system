import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import * as Toast from "../toast";

type ToasterItemDescriptionProps = PropsOf<typeof Toast.Description>;

export const ToasterItemDescriptionBase = component$(
  (props: ToasterItemDescriptionProps) => {
    return (
      <Toast.Description {...props} data-qds-toaster-item-description>
        <Slot />
      </Toast.Description>
    );
  }
);

export const ToasterItemDescription = withAsChild(ToasterItemDescriptionBase);
