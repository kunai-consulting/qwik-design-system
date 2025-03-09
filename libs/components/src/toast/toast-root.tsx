import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useStyles$,
  useVisibleTask$
} from "@qwik.dev/core";
import { usePopover } from "@qwik-ui/headless";
import { type ToastPosition, toastContextId } from "./toast-context";
import styles from "./toast.css?inline";
type PublicToastDataAttributes = {
  // The identifier for the root toast container
  "data-qds-toast-root"?: boolean;
  // Specifies the position of the toast on the screen
  "data-position"?: ToastPosition;
  // Indicates the visibility state of the toast (visible or hidden)
  "data-state"?: "visible" | "hidden";
};
type PublicRootProps = PropsOf<"div"> &
  PublicToastDataAttributes & {
    /** Position of the toast on the screen */
    position?: ToastPosition;
    /** Time in milliseconds before the toast automatically closes */
    duration?: number;
    /** Initial open state of the toast */
    open?: boolean;
    /** Reactive value that can be controlled via signal. Controls the open state of the toast */
    "bind:open"?: Signal<boolean>;
    /** Unique identifier for the toast */
    id?: string;
  };
/** A root component that manages toast state, positioning, and duration */
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
