import { $, type PropsOf, component$, useSignal } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Otp } from "@kunai-consulting/qwik";

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
  const isChange = useSignal(false);

  return (
    <>
      <Otp.Root
        onChange$={$(() => {
          console.log("onChange$");
          isChange.value = true;
        })}
        class="flex flex-col items-center justify-center"
      >
        <Otp.HiddenInput />
        <div class="otp-container flex flex-row justify-center gap-2">
          {Array.from({ length: 4 }, (_, index) => {
            const uniqueKey = `otp-${index}-${Date.now()}`;

            return (
              <Otp.Item
                key={uniqueKey}
                class={
                  "h-9 w-10 border-2 text-center data-[highlighted]:border-blue-600 rounded data-[highlighted]:ring-blue-100  data-[highlighted]:ring-[3px] data-[highlighted]:pl-1 data-[highlighted]:pr-1 caret-blue-600"
                }
              >
                <Otp.Caret class="text-blue-500 text-xl animate-blink-caret">|</Otp.Caret>
              </Otp.Item>
            );
          })}
        </div>
      </Otp.Root>
      {isChange.value && <p>onChange$</p>}
    </>
  );
});
