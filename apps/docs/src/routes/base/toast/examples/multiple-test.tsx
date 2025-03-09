import { component$, useSignal } from "@qwik.dev/core";
import { Toast } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen1 = useSignal(false);
  const isOpen2 = useSignal(false);

  return (
    <>
      <button type="button" id="toast1-trigger" onClick$={() => (isOpen1.value = true)}>
        Show Toast 1
      </button>
      <button type="button" id="toast2-trigger" onClick$={() => (isOpen2.value = true)}>
        Show Toast 2
      </button>

      <Toast.Root
        id="toast1"
        position="top-right"
        duration={3000}
        bind:open={isOpen1}
        class="bg-white shadow-lg rounded-lg p-4"
      >
        <Toast.Content>
          <div class="flex gap-2">
            <span>✅</span>
            <p>First toast message</p>
          </div>
        </Toast.Content>
      </Toast.Root>

      <Toast.Root
        id="toast2"
        position="bottom-right"
        duration={3000}
        bind:open={isOpen2}
        class="bg-white shadow-lg rounded-lg p-4"
      >
        <Toast.Content>
          <div class="flex gap-2">
            <span>⚠️</span>
            <p>Second toast message</p>
          </div>
        </Toast.Content>
      </Toast.Root>
    </>
  );
});
