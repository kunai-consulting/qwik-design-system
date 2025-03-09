import { component$, useSignal } from "@qwik.dev/core";
import { Toast } from "@kunai-consulting/qwik";

export default component$(() => {
  const isOpen = useSignal(false);

  return (
    <>
      <button type="button" id="show-button" onClick$={() => (isOpen.value = true)}>
        Show Toast
      </button>
      <button type="button" id="hide-button" onClick$={() => (isOpen.value = false)}>
        Hide Toast
      </button>

      <Toast.Root
        position="bottom-right"
        duration={5000}
        bind:open={isOpen}
        class="bg-white shadow-lg rounded-lg p-4"
      >
        <Toast.Content>
          <div class="flex gap-2">
            <span>✅</span>
            <p>Bind test message</p>
          </div>
        </Toast.Content>
      </Toast.Root>
    </>
  );
});
