import {
  component$,
  useContextProvider,
  useSignal,
  $,
  type QRL,
  Slot
} from "@builder.io/qwik";
import { Render } from "../render/render";
import {
  ToastContextId,
  type ToastContextState,
  type ToastData,
  type ToastOptions
} from "./toast.context";
import { withAsChild } from "../as-child/as-child";

export interface ToasterProps {
  /** Default duration (ms) for toasts. Can be overridden per toast.
   * @default 5000
   */
  duration?: number;
  /** Pause dismissal timer on hover/focus within the toast area.
   * @default true
   */
  pauseOnInteraction?: boolean;
  /** Maximum number of toasts displayed simultaneously.
   * @default 3
   */
  maxVisible?: number;
  /** CSS Gap between Items (user CSS might be better).
   * @default undefined
   */
  // gap?: number;
  /** Optional CSS class */
  class?: string;
}

export const ToasterRootBase = component$<ToasterProps>((props) => {
  const { ...rest } = props;
  const toastsSignal = useSignal<ToastData[]>([]);

  // Placeholder API implementation
  const addToast$: QRL<(options: ToastOptions) => string> = $(() => {
    // TODO: Implement add logic
    console.warn("addToast$ not implemented");
    return "placeholder-id";
  });

  const updateToast$: QRL<(id: string, options: Partial<ToastOptions>) => void> = $(
    () => {
      // TODO: Implement update logic
      console.warn("updateToast$ not implemented");
    }
  );

  const dismissToast$: QRL<(id: string) => void> = $((id: string) => {
    // TODO: Implement dismiss logic
    console.warn(`dismissToast$(${id}) not implemented`);
  });

  const dismissAllToasts$: QRL<() => void> = $(() => {
    // TODO: Implement dismiss all logic
    console.warn("dismissAllToasts$ not implemented");
  });

  const context: ToastContextState = {
    toasts: toastsSignal,
    add$: addToast$,
    update$: updateToast$,
    dismiss$: dismissToast$,
    dismissAll$: dismissAllToasts$
  };

  useContextProvider(ToastContextId, context);

  return (
    <Render
      fallback="div"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      tabIndex={-1}
      data-qds-toast-root
      {...rest}
    >
      <Slot />
    </Render>
  );
});

export const ToasterRoot = withAsChild(ToasterRootBase);
