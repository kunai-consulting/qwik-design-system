import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import * as Toast from "../toast";
import { toasterContextId } from "./toaster-context";

type ToasterItemProps = Omit<PropsOf<"div">, "onChange$"> & {
  onDismiss$?: () => void;
  duration?: number;
  role?: "status";
};

export const ToasterItemBase = component$((props: ToasterItemProps) => {
  const _index = getNextIndex("qds-toaster");
  const { onDismiss$, ...rest } = props;
  const context = useContext(toasterContextId);
  const isOpenSig = useSignal(false);

  // Find this toast in the context and sync its open state
  useTask$(({ track }) => {
    const toasts = track(() => context.toastsSig.value);
    const thisToast = toasts[_index];
    if (thisToast) {
      isOpenSig.value = thisToast.open;
    }
  });

  // Handle toast dismissal
  const handleChange$ = $((open: boolean) => {
    if (!open) {
      context.dismissToast(_index);
      onDismiss$?.();
    }
  });

  // Remove closed toasts from the array after animation
  useTask$(({ track }) => {
    const isOpen = track(() => isOpenSig.value);
    if (!isOpen) {
      setTimeout(() => {
        context.toastsSig.value = context.toastsSig.value.filter((_, i) => i !== _index);
      }, 300);
    }
  });

  // Find toast data for this item
  const toastData = context.toastsSig.value[_index];
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
