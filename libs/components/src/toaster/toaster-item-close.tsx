import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import * as Toast from "../toast";

type ToasterItemCloseProps = PropsOf<typeof Toast.Close>;

export const ToasterItemCloseBase = component$((props: ToasterItemCloseProps) => {
  return (
    <Toast.Close {...props} data-qds-toaster-item-close>
      <Slot />
    </Toast.Close>
  );
});

export const ToasterItemClose = withAsChild(ToasterItemCloseBase);
