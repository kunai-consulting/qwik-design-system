import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { type ToastData, type ToasterContext, toasterContextId } from "./toaster-context";
import styles from "./toaster.css?inline";
import {Render} from "../render/render";

type ToasterRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  onToastChange$?: (toasts: ToastData[]) => void;
  limit?: number;
  gap?: number;
  duration?: number;
} & BindableProps<{ toasts: ToastData[] }>;

export const ToasterRootBase = component$((props: ToasterRootProps) => {
  useStyles$(styles);

  const {
    "bind:toasts": givenToastsSig,
    onToastChange$,
    limit,
    gap = 8,
    duration = 5000,
    ...rest
  } = props;

  const { toastsSig } = useBindings(props, {
    toasts: [] as ToastData[]
  });

  const isInitialRenderSig = useSignal(true);

  const createToast = $((data: Partial<ToastData>) => {
    const id =
      data.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      id,
      open: true,
      duration: data.duration ?? duration,
      ...data
    };

    const currentToasts = toastsSig.value;
    let updatedToasts = [...currentToasts, newToast];

    // Apply limit if specified
    if (limit && updatedToasts.length > limit) {
      updatedToasts = updatedToasts.slice(-limit);
    }

    console.log(newToast)
    toastsSig.value = updatedToasts;
  });

  const dismissToast = $((id: string) => {
    toastsSig.value = toastsSig.value.map((toast) =>
      toast.id === id ? { ...toast, open: false } : toast
    );
  });

  const dismissAll = $(() => {
    toastsSig.value = toastsSig.value.map((toast) => ({ ...toast, open: false }));
  });

  const context: ToasterContext = {
    toastsSig,
    limit,
    gap,
    duration,
    createToast,
    dismissToast,
    dismissAll
  };

  useContextProvider(toasterContextId, context);

  // Handle onChange callback
  useTask$(({ track }) => {
    const toasts = track(() => toastsSig.value);

    // Only call onChange$ after initial render
    if (!isInitialRenderSig.value) {
      onToastChange$?.(toasts);
    }
  });

  // Mark initial render as complete
  useTask$(() => {
    isInitialRenderSig.value = false;
  });

  // Handle keyboard events (Escape to dismiss most recent toast)
  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      const openToasts = toastsSig.value.filter((toast) => toast.open);
      if (openToasts.length > 0) {
        const mostRecentToast = openToasts[openToasts.length - 1];
        dismissToast(mostRecentToast.id);
      }
    }
  });

  const customStyle = {
    "--toaster-gap": `${gap}px`
  };

  return (
    <Render
      {...rest}
      fallback="div"
      data-qds-toaster-root
      role="region"
      aria-label="Notifications"
      onKeyDown$={[handleKeyDown$, props.onKeyDown$]}
      style={Object.assign({}, customStyle, rest.style)}
    >
      <Slot />
    </Render>
  );
});

export const ToasterRoot = withAsChild(ToasterRootBase);
