import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useStyles$,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import * as Popover from "../popover";
import { Render } from "../render/render";
import { type ToastContext, toastContextId } from "./toast-context";
import toastStyles from "./toast.css?inline";

export type ToastRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  /**
   * Callback fired when the toast open state changes
   */
  onChange$?: (open: boolean) => void;

  /**
   * Duration in milliseconds before auto-dismissal. Set to null to disable auto-dismissal.
   */
  duration?: number | null;

  /**
   * Whether the toast should pause auto-dismissal when hovered
   * @default true
   */
  pauseOnHover?: boolean;
} & BindableProps<{ open: boolean }>;

export const ToastRootBase = component$((props: ToastRootProps) => {
  const {
    "bind:open": givenOpenSig,
    onChange$,
    duration = 5000, // Default 5 seconds
    pauseOnHover = true, // Default to pause on hover
    ...rest
  } = props;

  useStyles$(toastStyles);

  const rootRef = useSignal<HTMLDivElement>();
  const localId = useId();
  const contentRef = useSignal<HTMLDivElement>();

  const { openSig: isOpenSig } = useBindings(props, {
    open: false
  });

  const durationSig = useSignal<number | null>(duration);
  const isPausedSig = useSignal(false);
  const timeoutIdSig = useSignal<number | undefined>(undefined);

  const context: ToastContext = {
    localId,
    isOpenSig,
    durationSig
  };

  useContextProvider(toastContextId, context);

  // Pause auto-dismissal when hovering
  const handleMouseEnter$ = $(() => {
    if (pauseOnHover) {
      isPausedSig.value = true;
    }
  });

  // Resume auto-dismissal when no longer hovering
  const handleMouseLeave$ = $(() => {
    if (pauseOnHover) {
      isPausedSig.value = false;
    }
  });

  // Create a new timeout to close the toast
  const startTimer$ = $(() => {
    // Clear any existing timeout
    if (timeoutIdSig.value !== undefined) {
      window.clearTimeout(timeoutIdSig.value);
      timeoutIdSig.value = undefined;
    }

    // Don't set timer if duration is null
    if (durationSig.value === null) return;

    // Create new timeout
    timeoutIdSig.value = window.setTimeout(() => {
      isOpenSig.value = false;
    }, durationSig.value);
  });

  // Handle pause/unpause
  useTask$(({ track }) => {
    track(() => isPausedSig.value);
    const isOpen = track(() => isOpenSig.value);
    
    // Only process if toast is open
    if (!isOpen) return;
    
    // Only handle if we have a duration
    if (durationSig.value === null) return;

    // Clear timeout when paused
    if (isPausedSig.value && timeoutIdSig.value !== undefined) {
      window.clearTimeout(timeoutIdSig.value);
      timeoutIdSig.value = undefined;
    } 
    // Create new timeout when unpaused if none exists
    else if (!isPausedSig.value && timeoutIdSig.value === undefined) {
      startTimer$();
    }
  });

  // Handle open/close state changes
  useTask$(({ track }) => {
    const isOpen = track(() => isOpenSig.value);

    // Start timer when toast opens
    if (isOpen) {
      // Don't start timer if paused
      if (!isPausedSig.value) {
        startTimer$();
      }
    } 
    // Clear timer when toast closes
    else if (timeoutIdSig.value !== undefined) {
      window.clearTimeout(timeoutIdSig.value);
      timeoutIdSig.value = undefined;
    }
    
    // Fire onChange callback
    onChange$?.(isOpen);
  });

  // Handle duration changes
  useTask$(({ track }) => {
    const newDuration = track(() => props.duration);
    durationSig.value = newDuration ?? 5000;
    
    // If toast is open and not paused, restart timer with new duration
    if (isOpenSig.value && !isPausedSig.value) {
      startTimer$();
    }
  });

  // Cleanup on unmount
  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      if (timeoutIdSig.value !== undefined) {
        window.clearTimeout(timeoutIdSig.value);
      }
    });
  });

  const titleId = `${localId}-title`;
  const descriptionId = `${localId}-description`;

  return (
    <Render
      data-open={isOpenSig.value}
      data-closed={!isOpenSig.value}
      data-qds-toast-root
      data-paused={isPausedSig.value}
      internalRef={rootRef}
      fallback="div"
      onMouseEnter$={[handleMouseEnter$, props.onMouseEnter$]}
      onMouseLeave$={[handleMouseLeave$, props.onMouseLeave$]}
      {...rest}
    >
      <Slot />
      {isOpenSig.value && (
        <Popover.Root bind:open={isOpenSig}>
          <Popover.Content
            ref={contentRef}
            data-qds-toast-content
            role="status"
            aria-live="polite"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
          >
            <Slot />
          </Popover.Content>
        </Popover.Root>
      )}
    </Render>
  );
});

export const ToastRoot = withAsChild(ToastRootBase);
