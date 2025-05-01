import {
  $,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$,
  useVisibleTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { type Toast, toastContextId } from "./toast-context";

export interface ToasterItemProps {
  toast: Toast;
}

/** Individual toast component */
export const ToasterItemBase = component$((props: ToasterItemProps) => {
  const { toast } = props;
  const context = useContext(toastContextId);
  const isPaused = useSignal(false);
  const timerId = useSignal<number | undefined>(undefined);

  useVisibleTask$(({ cleanup }) => {
    if (!toast.duration) return;

    const startTimer = () => {
      timerId.value = window.setTimeout(() => {
        context.hide$();
      }, toast.duration);
    };

    startTimer();

    cleanup(() => {
      if (timerId.value) {
        window.clearTimeout(timerId.value);
      }
    });
  });

  useTask$(({ track }) => {
    track(() => isPaused.value);

    if (!(toast.duration && context.pauseOnHover.value)) return;

    if (isPaused.value && timerId.value) {
      window.clearTimeout(timerId.value);
      timerId.value = undefined;
    } else if (!(isPaused.value || timerId.value)) {
      timerId.value = window.setTimeout(() => {
        context.hide$();
      }, toast.duration);
    }
  });

  const getRole = () => {
    return toast.type === "error" || toast.type === "warning" ? "alert" : "status";
  };

  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      context.hide$();
    }
  });

  return (
    <Render
      role={getRole()}
      data-qds-toaster-item
      data-type={toast.type}
      data-state="open"
      tabIndex={0}
      onMouseEnter$={() => {
        isPaused.value = true;
      }}
      onMouseLeave$={() => {
        isPaused.value = false;
      }}
      onKeyDown$={handleKeyDown$}
      fallback="div"
    >
      <Slot />
    </Render>
  );
});

export const ToasterItem = withAsChild(ToasterItemBase);
