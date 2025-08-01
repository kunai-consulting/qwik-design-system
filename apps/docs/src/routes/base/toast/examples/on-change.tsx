import { Toast } from "@kunai-consulting/qwik";
import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import styles from "./toast-example.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isOpen = useSignal(false);
  const changeCount = useSignal(0);

  const handleChange$ = $((open: boolean) => {
    changeCount.value++;
  });

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
      <p>onChange called: {changeCount.value}</p>
      <Toast.Root bind:open={isOpen} onChange$={handleChange$}>
        <Toast.Title>onChange Toast</Toast.Title>
        <Toast.Description>This toast demonstrates onChange$ callback</Toast.Description>
        <Toast.Close>Close Me</Toast.Close>
      </Toast.Root>
    </div>
  );
});
