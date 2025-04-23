import {
  Slot,
  component$,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
  type PropsOf
} from "@builder.io/qwik";
import { PopoverContentBase } from "../popover/popover-content"; // Use base directly
import type { ToastData } from "./toast.context";
import { ToastItemContextId, type ToastItemContextState } from "./toast.context";
import { withAsChild } from "../as-child/as-child";

// Props passed internally by the Toaster when rendering an item
// No longer needs BindableProps for open state
export type ToastItemProps = Omit<PropsOf<typeof PopoverContentBase>, "toast"> & {
  toast: ToastData;
};

const ToastItemBase = component$<ToastItemProps>((props) => {
  // Root context for dismiss etc. (if needed later)
  // const rootContext = useContext(ToastContextId);

  const { toast, ...rest } = props;
  const popoverRef = useSignal<HTMLDivElement>();

  // Provide item-specific context including the controlling signal
  const itemContext: ToastItemContextState = {
    toast: toast,
    isOpenSig: toast.isOpenSig // Directly use the signal from props.toast
  };
  useContextProvider(ToastItemContextId, itemContext);

  // Get the signal from the context we just provided
  const { isOpenSig } = useContext(ToastItemContextId);

  // Manually show/hide based on the state signal (driven by Toaster)
  useVisibleTask$(
    ({ track }) => {
      track(() => isOpenSig.value);
      const element = popoverRef.value;
      if (element) {
        try {
          if (isOpenSig.value) {
            element.showPopover();
          } else if (element.isConnected && element.matches(":popover-open")) {
            element.hidePopover();
          }
        } catch (e) {
          console.warn("[Toaster]: Popover toggle error ignored:", e);
        }
      }
    },
    { strategy: "intersection-observer" }
  ); // Changed strategy

  return (
    <PopoverContentBase
      {...rest}
      popover="manual"
      id={toast.id}
      ref={popoverRef}
      role={toast.role ?? "status"}
      aria-live={toast.role === "alert" ? "assertive" : "polite"}
      aria-atomic="true"
      data-qds-toast-item // Added prefix
      data-open={isOpenSig.value ? "" : undefined}
      data-closed={!isOpenSig.value ? "" : undefined}
      // Prevent popover internal toggle handling if needed (manual control)
      onToggle$={(e) => {
        e.preventDefault();
      }}
    >
      <Slot />
    </PopoverContentBase>
  );
});

export const ToastItem = withAsChild(ToastItemBase);
