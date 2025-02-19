import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Toast } from "@kunai-consulting/qwik";
import styles from "./toast.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isOpen = useSignal(false);

  return (
    <>
      <button
        onClick$={() => {
          isOpen.value = true;
        }}
      >
        Show Toast
      </button>

      <Toast.Root
        id="success-toast"
        position="top-center"
        duration={5000}
        bind:open={isOpen}
        class="toast-root"
      >
        <Toast.Content>
          <div class="toast-content">
            <span>✅</span>
            <p>Operation completed successfully!</p>
          </div>
        </Toast.Content>
      </Toast.Root>
    </>
  );
});
