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
  position?: "top" | "top-right" | "top-left" | "bottom" | "bottom-right" | "bottom-left";
  role?: "alert" | "status";
} & BindableProps<{ open: boolean }>;

export const ToastRootBase = component$((props: ToastRootProps) => {
  useStyles$(styles);
  const {
    "bind:open": givenOpenSig,
    onChange$,
    duration = 5000,
    position = "top",
    role = "alert",
    ...rest
  } = props;

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
    role,
    position,
    duration
  };

  useContextProvider(toastContextId, context);

  // Auto-dismiss functionality with pause-on-hover
  useTask$(({ track, cleanup }) => {
    track(() => isOpenSig.value);
    track(() => isHoveredSig.value);

    // Only call onChange$ after initial render
    if (!isInitialRenderSig.value) {
      onChange$?.(isOpenSig.value);
    }

    // Auto-dismiss functionality
    if (isOpenSig.value && duration !== 0 && duration > 0) {
      if (isHoveredSig.value) {
        // Toast is hovered - pause the timer and store remaining time
        if (startTimeSig.value !== null) {
          const elapsed = Date.now() - startTimeSig.value;
          remainingTimeSig.value = Math.max(0, remainingTimeSig.value - elapsed);
          startTimeSig.value = null;
        }
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

    // Mark that initial render is complete
    cleanup(() => {
      if (!isInitialRenderSig.value) return;
      isInitialRenderSig.value = false;
    });
  });

  const handleMouseEnter$ = $(() => {
    isHoveredSig.value = true;
  });

  const handleMouseLeave$ = $(() => {
    isHoveredSig.value = false;
  });

  const ariaLive = role === "alert" ? "assertive" : "polite";

  return (
    <Render
      data-qds-toast-root
      fallback="div"
      role={role}
      aria-live={ariaLive}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-open={isOpenSig.value}
      data-closed={!isOpenSig.value}
      data-position={position}
    >
      <Popover.Root bind:open={isOpenSig} {...rest}>
        <Popover.Content
          data-qds-toast-content
          data-position={position}
          popover="auto"
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
