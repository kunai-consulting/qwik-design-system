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
  useTask$(({ track }) => {
    const isOpen = track(() => isOpenSig.value);

    // Only call onChange$ after initial render and when open state actually changes
    if (!isInitialRenderSig.value) {
      onChange$?.(isOpen);
    }
  });

  // Auto-dismiss functionality with pause-on-hover
  useTask$(({ track, cleanup }) => {
    track(() => isOpenSig.value);
    track(() => isHoveredSig.value);

    // Auto-dismiss functionality
    if (isOpenSig.value && duration !== 0 && duration > 0) {
      if (isHoveredSig.value) {
        if (startTimeSig.value === null) {
          return;
        }
        // Toast is hovered - pause the timer and store remaining time
        const elapsed = Date.now() - startTimeSig.value;
        remainingTimeSig.value = Math.max(0, remainingTimeSig.value - elapsed);
        startTimeSig.value = null;
      } else {
        // Toast is not hovered - start or resume the timer
        if (startTimeSig.value === null) {
          startTimeSig.value = Date.now();
        }

        const timeoutId = setTimeout(() => {
          isOpenSig.value = false;
        }, remainingTimeSig.value);

        cleanup(() => clearTimeout(timeoutId));
      }
    } else if (!isOpenSig.value) {
      // Reset timer state when toast is closed
      remainingTimeSig.value = duration;
      startTimeSig.value = null;
    }
  });

  // Mark initial render as complete
  useTask$(() => {
    isInitialRenderSig.value = false;
  });

  const handleMouseEnter$ = $(() => {
    isHoveredSig.value = true;
  });

  const handleMouseLeave$ = $(() => {
    isHoveredSig.value = false;
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
          onMouseEnter$={[handleMouseEnter$, props.onMouseEnter$]}
          onMouseLeave$={[handleMouseLeave$, props.onMouseLeave$]}
        >
          <Slot />
        </Popover.Content>
      </Popover.Root>
    </Render>
  );
});

export const ToastRoot = withAsChild(ToastRootBase);
