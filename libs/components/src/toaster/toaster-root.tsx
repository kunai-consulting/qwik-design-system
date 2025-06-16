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
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type ToastData, type ToasterContext, toasterContextId } from "./toaster-context";
import styles from "./toaster.css?inline";

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
    const newToast: ToastData = {
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

    console.log(newToast);
    toastsSig.value = updatedToasts;
  });

  const dismissToast = $((index: number) => {
    toastsSig.value = toastsSig.value.map((toast, i) =>
      i === index ? { ...toast, open: false } : toast
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
  const handleKeyDown$ = $(async (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      const openToasts = toastsSig.value.filter((toast) => toast.open);
      if (openToasts.length > 0) {
        const mostRecent = openToasts[openToasts.length - 1];
        const mostRecentIndex = toastsSig.value.lastIndexOf(mostRecent);
        await dismissToast(mostRecentIndex);
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

export const ToasterRoot = withAsChild(ToasterRootBase, (props) => {
  resetIndexes("qds-toaster");

  return props;
});
