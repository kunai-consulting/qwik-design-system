import {
  component$,
  useContextProvider,
  useSignal,
  useStyles$,
  useVisibleTask$,
  type PropsOf,
  type Signal,
  Slot
} from "@builder.io/qwik";
import { usePopover } from "@qwik-ui/headless";
import { toastContextId, type ToastPosition } from "./toast-context";
import styles from "./toast.css?inline";

type ToastDataAttributes = {
  "data-qds-toast-root"?: boolean;
  "data-position"?: ToastPosition;
  "data-state"?: "visible" | "hidden";
};

type PublicRootProps = PropsOf<"div"> & ToastDataAttributes & {
  position?: ToastPosition;
  duration?: number;
  open?: boolean;
  "bind:open"?: Signal<boolean>;
  id?: string;
};

export const ToastRoot = component$<PublicRootProps>((props) => {
  useStyles$(styles);

  const rootRef = useSignal<HTMLDivElement>();
  const isOpen = useSignal(props.open ?? false);

  const {
    position = "bottom-right",
    duration = 5000,
    "bind:open": bindOpen,
    id,
    ...restProps
  } = props;

  const toastId = useSignal(id || `toast-${crypto.randomUUID()}`);
  const popover = usePopover(toastId.value);

  useVisibleTask$(({ track }) => {
    const openValue = track(() => bindOpen?.value);
    if (openValue !== undefined) {
      isOpen.value = openValue;

      if (openValue && duration > 0) {
        const timer = setTimeout(() => {
          isOpen.value = false;
          if (bindOpen) {
            bindOpen.value = false;
          }
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  });

  useVisibleTask$(({ track }) => {
    const currentIsOpen = track(() => isOpen.value);
    if (currentIsOpen) {
      popover.showPopover();
    } else {
      popover.hidePopover();
    }
  });

  const context = {
    rootRef,
    position,
    isOpen,
    duration
  };

  useContextProvider(toastContextId, context);

  return (
    <div
      {...restProps}
      ref={rootRef}
      id={toastId.value}
      data-qds-toast-root
      data-position={position}
      data-state={isOpen.value ? "visible" : "hidden"}
    >
      <Slot />
    </div>
  );
});
