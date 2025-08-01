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
      <p>Is open: {isOpen.value.toString()}</p>
      <Toast.Root bind:open={isOpen}>
        <Toast.Title>Signal Binding Toast</Toast.Title>
        <Toast.Description>This toast demonstrates signal binding</Toast.Description>
        <Toast.Close>Close Me</Toast.Close>
      </Toast.Root>
    </div>
  );
});
