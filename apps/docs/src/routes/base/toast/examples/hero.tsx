import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Toast } from "@kunai-consulting/qwik";
import styles from "./toast.css?inline";
import { LuX } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);
  const isOpen = useSignal(false);

  return (
    <>
        <Toast.Root bind:open={isOpen} class="toast" duration={1000} pauseOnHover>
          <Toast.Title class="toast-title">Toast Title</Toast.Title>
          <Toast.Description class="toast-description">Toast Description</Toast.Description>
          <Toast.Close class="toast-close">
            <LuX />
          </Toast.Close>
        </Toast.Root>
      <p>Is open: {isOpen.value ? "true" : "false"}</p>
      <button type="button" onClick$={() => (isOpen.value = !isOpen.value)} class="toast-trigger">
        Toggle toast
      </button>
    </>
  );
});
