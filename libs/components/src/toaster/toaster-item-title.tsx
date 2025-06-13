import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import * as Toast from "../toast";

type ToasterItemTitleProps = PropsOf<typeof Toast.Title>;

export const ToasterItemTitleBase = component$((props: ToasterItemTitleProps) => {
  return (
    <Toast.Title {...props} data-qds-toaster-item-title>
      <Slot />
    </Toast.Title>
  );
});

export const ToasterItemTitle = withAsChild(ToasterItemTitleBase);
