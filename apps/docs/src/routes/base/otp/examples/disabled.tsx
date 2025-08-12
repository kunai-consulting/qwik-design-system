import { Otp } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";
import type { DocumentHead } from "@qwik.dev/router";

export const head: DocumentHead = {
  title: "Qwik Design System",
  meta: [
    {
      name: "description",
      content: "Qwik Design System"
    }
  ]
};

export default component$(() => {
  const isDisabled = useSignal(false);
  const slots = [...Array(4).keys()];

  return (
    <>
      <Otp.Root
        disabled={isDisabled.value}
        class="flex flex-col items-center justify-center"
      >
        <Otp.HiddenInput />

        <div class="otp-container flex flex-row justify-center gap-2">
          {slots.map((slot) => {
            return (
              <Otp.Item
                key={slot}
                class={
                  "h-9 w-10 border-2 text-center data-[highlighted]:border-blue-600 rounded data-[highlighted]:ring-blue-100  data-[highlighted]:ring-[3px] data-[highlighted]:pl-1 data-[highlighted]:pr-1 caret-blue-600 data-[disabled]:opacity-50"
                }
              >
                <Otp.ItemIndicator class="text-blue-500 text-xl animate-blink-caret">
                  |
                </Otp.ItemIndicator>
              </Otp.Item>
            );
          })}
        </div>
      </Otp.Root>

      <button type="button" onClick$={() => (isDisabled.value = !isDisabled.value)}>
        Disable OTP
      </button>
    </>
  );
});
