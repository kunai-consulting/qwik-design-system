import {
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useVisibleTask$,
  type PropsOf
} from "@builder.io/qwik";
import { PopoverContentBase } from "../popover/popover-content";
import { ToastItemContextId, type ToastItemContextState } from "./toast.context";
import { withAsChild } from "../as-child/as-child";
import { type BindableProps, useBindings } from "libs/components/utils/bindings";

type ToastItemProps = PropsOf<"div"> & BindableProps<{ open: boolean }>;

const ToastItemBase = component$<ToastItemProps>((props) => {
  const { ...rest } = props;
  const popoverRef = useSignal<HTMLDivElement>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  // Manually show the popover when the component becomes visible (mounts)
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    popoverRef.value?.showPopover();
  });

  // TODO: Need a mechanism to call hidePopover() before removal (e.g., in dismiss logic)

  // Provide item-specific context
  const itemContext: ToastItemContextState = {
    isOpenSig
  };
  useContextProvider(ToastItemContextId, itemContext);

  return (
    // Use PopoverContent, but override/add necessary props for Toast behavior
    <PopoverContentBase
      {...rest} // Pass class etc.
      // Crucial: Override to manual for programmatic control
      popover="manual"
      // Get ref for programmatic show/hide
      ref={popoverRef}
      // Basic ARIA for the toast item - applied to the popover content
      role="status"
      aria-live="polite"
      aria-atomic="true"
      // Data attributes for state and styling
      data-qds-toast-item
      // Use data-open/data-closed based on actual state
      data-open={isOpenSig.value ? "" : undefined}
      data-closed={!isOpenSig.value ? "" : undefined}
    >
      <Slot /> {/* Content passed by consumer or rendered internally */}
    </PopoverContentBase>
  );
});

export const ToastItem = withAsChild(ToastItemBase);
