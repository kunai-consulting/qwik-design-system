import {
  $,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type Toast, type ToastContext, toastContextId } from "./toast-context";

export type ToasterRootProps = {
  duration?: number;
  pauseOnHover?: boolean;
};

export const ToasterRootBase = component$((props: ToasterRootProps) => {
  const { duration = 5000, pauseOnHover = true, ...rest } = props;
  const localId = useId();

  const currentToast = useSignal<Toast | null>(null);
  const durationSig = useSignal(duration);
  const pauseOnHoverSig = useSignal(pauseOnHover);

  useTask$(({ track }) => {
    track(() => duration);
    durationSig.value = duration;
  });

  useTask$(({ track }) => {
    track(() => pauseOnHover);
    pauseOnHoverSig.value = pauseOnHover;
  });

  const show$ = $((toast: Omit<Toast, "id">) => {
    const id = `toast-${Math.random().toString(36).substring(2, 9)}`;
    currentToast.value = { ...toast, id };
  });

  const hide$ = $(() => {
    currentToast.value = null;
  });

  const context: ToastContext = {
    localId,
    currentToast,
    duration: durationSig,
    pauseOnHover: pauseOnHoverSig,
    show$,
    hide$
  };

  useContextProvider(toastContextId, context);

  return (
    <Render {...rest} fallback="div" data-qds-toaster-root aria-live="polite">
      <Slot />
    </Render>
  );
});

export const ToasterRoot = withAsChild(ToasterRootBase);
