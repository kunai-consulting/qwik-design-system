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
            title: "Toast With Close Button",
            description: "Click the X to dismiss this."
            // closeButton: true, // Assuming true is default, otherwise set explicitly
          })
        }
      >
        Add Toast With Close Button
      </button>
      {/* Add other buttons if needed for testing this scenario */}
    </div>
  );
});

/**
 * Example showing toasts rendered with a close button for user dismissal.
 */
export default component$(() => {
  useStyles$(styles);
  return (
    <Toaster.Root>
      <ToastControls />
    </Toaster.Root>
  );
});
