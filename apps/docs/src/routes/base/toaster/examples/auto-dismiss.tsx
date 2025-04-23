import { component$, useStyles$, useContext } from "@builder.io/qwik";
import {
  Toaster,
  useToast,
  ToastContextId,
  type ToastContextState
} from "@kunai-consulting/qwik";
import styles from "./toaster.css?inline";

const ToastControls = component$(() => {
  useStyles$(styles);
  const toast = useToast();
  const context = useContext<ToastContextState>(ToastContextId);

  return (
    <div class="controls">
      <p>Current Toast Count: {context?.toasts.value.length ?? 0}</p>
      <button
        type="button"
        onClick$={() =>
          toast.add$({
            title: "Auto Dismissing Toast",
            description: "This will disappear in 3 seconds.",
            duration: 3000 // Set duration for auto-dismissal
          })
        }
      >
        Add Auto-Dismiss Toast (3s)
      </button>
      {/* Add other buttons if needed for testing this scenario */}
    </div>
  );
});

/**
 * Example showing toasts that automatically dismiss after a duration.
 */
export default component$(() => {
  useStyles$(styles);
  return (
    <Toaster.Root>
      <ToastControls />
    </Toaster.Root>
  );
});
