import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import * as Popover from "../popover";
import { Render } from "../render/render";
import { type ToastContext, toastContextId } from "./toast-context";
import styles from "./toast.css?inline";

type ToastRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  onChange$?: (open: boolean) => void;
  duration?: number;
} & BindableProps<{ open: boolean }>;

export const ToastRootBase = component$((props: ToastRootProps) => {
  useStyles$(styles);
  const { "bind:open": givenOpenSig, onChange$, duration = 5000, ...rest } = props;

  const localId = useId();
  const titleId = `${localId}-title`;
  const descriptionId = `${localId}-description`;
  const isInitialRenderSig = useSignal(true);
  const isHoveredSig = useSignal(false);
  const isFocusedSig = useSignal(false);
  const remainingTimeSig = useSignal(duration);
  const startTimeSig = useSignal<number | null>(null);

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const context: ToastContext = {
    localId,
    isOpenSig,
    titleId,
    descriptionId,
    duration
  };

  useContextProvider(toastContextId, context);

  // Handle onChange callback - separate from hover logic
  useTask$(({ track, cleanup }) => {
    const isOpen = track(() => isOpenSig.value);

    // Only call onChange$ after initial render
    if (!isInitialRenderSig.value) {
      onChange$?.(isOpen);
    }

    // Mark initial render as complete after first run
    cleanup(() => {
      isInitialRenderSig.value = false;
    });
  });

  // Auto-dismiss functionality with pause-on-hover/focus
  useTask$(({ track, cleanup }) => {
    track(() => isOpenSig.value);
    track(() => isHoveredSig.value);
    track(() => isFocusedSig.value);

    // Reset timer state when toast is closed
    if (!isOpenSig.value) {
      remainingTimeSig.value = duration;
      startTimeSig.value = null;
      return;
    }

    // No auto-dismiss if duration is 0 or negative
    if (duration === 0 || duration <= 0) {
      return;
    }

    // Toast is hovered or focused - pause the timer
    if (isHoveredSig.value || isFocusedSig.value) {
      if (startTimeSig.value === null) {
        return; // Already paused
      }

      // Pause the timer and store remaining time
      const elapsed = Date.now() - startTimeSig.value;
      remainingTimeSig.value = Math.max(0, remainingTimeSig.value - elapsed);
      startTimeSig.value = null;
      return;
    }

    // Toast is not hovered or focused - start or resume the timer
    if (startTimeSig.value === null) {
      startTimeSig.value = Date.now();
    }

    const timeoutId = setTimeout(() => {
      isOpenSig.value = false;
    }, remainingTimeSig.value);

    cleanup(() => clearTimeout(timeoutId));
  });

  const handlePointerEnter$ = $(() => {
    isHoveredSig.value = true;
  });

  const handlePointerLeave$ = $(() => {
    isHoveredSig.value = false;
  });

  const handleFocus$ = $(() => {
    isFocusedSig.value = true;
  });

  const handleBlur$ = $(() => {
    isFocusedSig.value = false;
  });

  return (
    <Render
      data-qds-toast-root
      fallback="div"
      role="status"
      aria-live="polite"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-open={isOpenSig.value}
      data-closed={!isOpenSig.value}
    >
      <Popover.Root bind:open={isOpenSig} {...rest}>
        <Popover.Content
          data-qds-toast-content
          popover="auto"
          role="status"
          aria-live="polite"
          tabIndex={0}
          onPointerEnter$={[handlePointerEnter$, props.onPointerEnter$]}
          onPointerLeave$={[handlePointerLeave$, props.onPointerLeave$]}
          onFocus$={[handleFocus$, props.onFocus$]}
          onBlur$={[handleBlur$, props.onBlur$]}
        >
          <Slot />
        </Popover.Content>
      </Popover.Root>
    </Render>
  );
});

export const ToastRoot = withAsChild(ToastRootBase);
