import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Toast } from "@kunai-consulting/qwik";
import { LuX } from "@qwikest/icons/lucide";
import styles from "./toast-example.css?inline";

export default component$(() => {
  const isOpen = useSignal(false);
  useStyles$(styles);
  return (
    <>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <button
        type="button"
        class="toast-trigger"
        data-qds-toast-trigger
        onClick$={() => {
          isOpen.value = true;
        }}
      >
        Open Toast
      </button>
      <Toast.Root
        duration={50000}
        pauseOnHover
        open={isOpen.value}
        onChange$={(open: boolean) => {
          // Updates the signal when the toast is opened or closed
          isOpen.value = open;
        }}
      >
        <div>
          <Toast.Title class="toast-title">Test Toast Title</Toast.Title>
          <Toast.Description class="toast-description">
            This is a toast description.
          </Toast.Description>
        </div>
        <Toast.Close class="toast-close">
          <LuX />
        </Toast.Close>
      </Toast.Root>
    </>
  );
});
