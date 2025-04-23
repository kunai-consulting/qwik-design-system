import { component$, useStyles$, useContext } from "@builder.io/qwik";
import {
  Toaster,
  useToast,
  ToastContextId,
  type ToastContextState
} from "@kunai-consulting/qwik";
import styles from "./toaster.css?inline";

// Component with buttons to control toasts
const ToastControls = component$(() => {
  useStyles$(styles);
  const toast = useToast();
  const context = useContext<ToastContextState>(ToastContextId); // Get context for count

  return (
    <div class="controls">
      <p>Current Toast Count: {context?.toasts.value.length ?? 0}</p>
      <button type="button" onClick$={() => toast.add$({ title: "Programmatic Toast" })}>
        Add Basic
      </button>
      <button
        type="button"
        onClick$={() =>
          toast.add$({
            title: "With Description",
            description: "This toast has more details."
          })
        }
      >
        Add With Description
      </button>
      <button
        type="button"
        onClick$={() => {
          const toasts = context?.toasts.value;
          if (toasts && toasts.length > 0) {
            toast.dismiss$(toasts[toasts.length - 1].id);
          }
        }}
      >
        Dismiss Last
      </button>
      <button type="button" onClick$={() => toast.dismissAll$()}>
        Dismiss All
      </button>
    </div>
  );
});

/**
 * Example showing programmatic control of toasts using the useToast hook.
 */
export default component$(() => {
  useStyles$(styles);
  return (
    <Toaster.Root>
      {/* Controls are placed inside so they have access to the context */}
      <ToastControls />
    </Toaster.Root>
  );
});
