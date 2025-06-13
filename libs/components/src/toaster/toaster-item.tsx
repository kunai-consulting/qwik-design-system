import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import * as Toast from "../toast";
import { toasterContextId } from "./toaster-context";

type ToasterItemProps = PropsOf<"div"> & {
  id: string;
  onDismiss$?: () => void;
  duration?: number;
  role?: "status";
};

export const ToasterItemBase = component$((props: ToasterItemProps) => {
  const { id, onDismiss$, ...rest } = props;
  const context = useContext(toasterContextId);
  const isOpenSig = useSignal(false);

  // Find this toast in the context and sync its open state
  useTask$(({ track }) => {
    const toasts = track(() => context.toastsSig.value);
    const thisToast = toasts.find((toast) => toast.id === id);

    if (thisToast) {
      isOpenSig.value = thisToast.open;
    }
  });

  // Handle toast dismissal
  const handleChange$ = $((open: boolean) => {
    if (!open) {
      context.dismissToast(id);
      onDismiss$?.();
    }
  });

  // Remove closed toasts from the array after animation
  useTask$(({ track }) => {
    const isOpen = track(() => isOpenSig.value);

    if (!isOpen) {
      // Wait for animation to complete before removing from array
      setTimeout(() => {
        context.toastsSig.value = context.toastsSig.value.filter(
          (toast) => toast.id !== id
        );
      }, 300); // Adjust timing based on your CSS animation duration
    }
  });

  // Find toast data for this item
  const toastData = context.toastsSig.value.find((toast) => toast.id === id);

  if (!toastData) {
    return null;
  }

  return (
    <Toast.Root
      {...rest}
      data-qds-toaster-item
      bind:open={isOpenSig}
      onChange$={handleChange$}
      duration={toastData.duration}
    >
      <Slot />
    </Toast.Root>
  );
});

export const ToasterItem = withAsChild(ToasterItemBase);
