import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Toast } from "@kunai-consulting/qwik";
import styles from "./toast-example.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isOpen = useSignal(false);

  return (
    <div>
      <button
        type="button"
        class="toast-trigger"
        onClick$={() => {
          isOpen.value = true;
        }}
      >
        Open Toast
      </button>
      <Toast.Root bind:open={isOpen} role="status">
        <Toast.Title>Status Toast</Toast.Title>
        <Toast.Description>This is a status message with role="status"</Toast.Description>
        <Toast.Close>Close Me</Toast.Close>
      </Toast.Root>
    </div>
  );
});
