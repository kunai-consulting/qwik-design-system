import { Toast } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";
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
      <Toast.Root bind:open={isOpen} class="toast-root">
        <Toast.Title>Toast Accessible Title</Toast.Title>
        <Toast.Description>Toast Accessible Description</Toast.Description>
        <Toast.Close class="toast-close">Close Me</Toast.Close>
      </Toast.Root>
    </div>
  );
});
