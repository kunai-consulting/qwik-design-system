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
      <Toast.Root bind:open={isOpen} duration={2000} position={"bottom"}>
        <Toast.Title>Custom Duration Toast</Toast.Title>
        <Toast.Description>
          This toast will close automatically after 2 seconds
        </Toast.Description>
        <Toast.Close>Close Me</Toast.Close>
      </Toast.Root>
    </div>
  );
});
