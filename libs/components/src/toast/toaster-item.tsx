import {
  Slot,
  component$,
  useContext,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import * as Popover from "../popover";
import { type Toast, toastContextId } from "./toast-context";
import styles from "./toaster.css?inline";

export interface ToasterItemProps {
  toast: Toast;
}

/** Individual toast component */
export const ToasterItemBase = component$((props: ToasterItemProps) => {
  // Apply global styles for fixed positioning
  useStyles$(styles);

  const { toast } = props;
  const context = useContext(toastContextId);
  const isPaused = useSignal(false);
  const timerId = useSignal<number | undefined>(undefined);
  const contentRef = useSignal<HTMLDivElement>();
  const triggerRef = useSignal<HTMLButtonElement>();
  const isShown = useSignal(false);

  // Set up auto-dismiss timer
  useVisibleTask$(({ cleanup }) => {
    if (!toast.duration) return;

    // Show the popover once mounted
    if (contentRef.value) {
      contentRef.value.showPopover();
      isShown.value = true;
    }

    const startTimer = () => {
      timerId.value = window.setTimeout(() => {
        if (contentRef.value) {
          contentRef.value.hidePopover();
          // Give time for animation before removing from state
          setTimeout(() => {
            context.hide$();
          }, 300);
        } else {
          context.hide$();
        }
      }, toast.duration);
    };

    startTimer();

    cleanup(() => {
      if (timerId.value) {
        window.clearTimeout(timerId.value);
      }
    });
  });

  // Handle pause on hover
  useTask$(({ track }) => {
    track(() => isPaused.value);

    if (!(toast.duration && context.pauseOnHover.value)) return;

    if (isPaused.value && timerId.value) {
      window.clearTimeout(timerId.value);
      timerId.value = undefined;
    } else if (!(isPaused.value || timerId.value)) {
      timerId.value = window.setTimeout(() => {
        if (contentRef.value) {
          contentRef.value.hidePopover();
          // Give time for animation before removing from state
          setTimeout(() => {
            context.hide$();
          }, 300);
        } else {
          context.hide$();
        }
      }, toast.duration);
    }
  });

  return (
    <Popover.Root open={true}>
      {/* Hidden trigger element for positioning */}
      <Popover.Trigger ref={triggerRef} aria-hidden="true" tabIndex={-1} />

      <Popover.Content
        ref={contentRef}
        role="status"
        data-qds-toaster-item
        data-state="open"
        tabIndex={0}
        onMouseEnter$={() => {
          isPaused.value = true;
        }}
        onMouseLeave$={() => {
          isPaused.value = false;
        }}
      >
        <Slot />
      </Popover.Content>
    </Popover.Root>
  );
});

export const ToasterItem = withAsChild(ToasterItemBase);
