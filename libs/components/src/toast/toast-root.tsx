import {
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

  // Auto-dismiss functionality and onChange handling
  useTask$(({ track, cleanup }) => {
    track(() => isOpenSig.value);

    // Only call onChange$ after initial render
    if (!isInitialRenderSig.value) {
      onChange$?.(isOpenSig.value);
    }

    // Auto-dismiss functionality
    if (isOpenSig.value && duration !== 0 && duration > 0) {
      const timeoutId = setTimeout(() => {
        isOpenSig.value = false;
      }, duration);

      cleanup(() => clearTimeout(timeoutId));
    }

    // Mark that initial render is complete
    cleanup(() => {
      if (!isInitialRenderSig.value) return;
      isInitialRenderSig.value = false;
    });
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
        <Popover.Content data-qds-toast-content data-position={position} popover="auto">
          <Slot />
        </Popover.Content>
      </Popover.Root>
    </Render>
  );
});

export const ToastRoot = withAsChild(ToastRootBase);
