import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import {
  type Toast,
  type ToastContext,
  type ToastQueue,
  toastContextId
} from "./toast-context";

export type ToasterRootProps = {
  duration?: number;
  pauseOnHover?: boolean;
} & PropsOf<"div">;

type ToasterRootBinds = {
  /* Duration of the toast */
  duration: number;
  /* Whether the toast should pause on hover */
  pauseOnHover: boolean;
};

export const ToasterRootBase = component$((props: ToasterRootProps) => {
  const { duration = 5000, pauseOnHover = true, ...rest } = props;
  const localId = useId();

  const { durationSig, pauseOnHoverSig } = useBindings<ToasterRootBinds>(props, {
    duration: 5000,
    pauseOnHover: true
  });

  const toastQueue = useSignal<ToastQueue>([]);
  const currentToast = useSignal<Toast | null>(null);

  // Process queue when currentToast changes
  useTask$(({ track }) => {
    track(() => currentToast.value);
    track(() => toastQueue.value.length);

    // If no current toast and queue has items, show next toast
    if (!currentToast.value && toastQueue.value.length > 0) {
      currentToast.value = toastQueue.value[0];
      toastQueue.value = toastQueue.value.slice(1);
    }
  });

  const show$ = $((toast: Omit<Toast, "id">) => {
    const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { ...toast, id };

    if (!currentToast.value) {
      // If no toast is showing, display immediately
      currentToast.value = newToast;
    } else {
      // Otherwise add to queue
      toastQueue.value = [...toastQueue.value, newToast];
    }
  });

  const hide$ = $(() => {
    currentToast.value = null;
  });

  const context: ToastContext = {
    localId,
    toastQueue,
    currentToast,
    duration: durationSig,
    pauseOnHover: pauseOnHoverSig,
    show$,
    hide$
  };

  useContextProvider(toastContextId, context);

  return (
    <Render
      {...rest}
      fallback="div"
      data-qds-toaster-root
      aria-live={rest["aria-live"] || "polite"}
    >
      <Slot />
    </Render>
  );
});

export const ToasterRoot = withAsChild(ToasterRootBase);
