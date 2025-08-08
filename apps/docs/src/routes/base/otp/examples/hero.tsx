import { Checkbox, Otp } from "@kunai-consulting/qwik";
import { type PropsOf, Slot, component$ } from "@qwik.dev/core";
import { LuCheck } from "@qwikest/icons/lucide";

export const MyDiv = component$((props: PropsOf<"div">) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});

export default component$(() => {
  const slots = [...Array(4).keys()];

  return (
    <div class="flex flex-col items-center gap-4">
      <div class="max-w-80 flex flex-col items-center text-center">
        <InformationCircle class="*:stroke-qwik-blue-600" />
        <h2 class="py-4 text-lg font-semibold">Two-step verification</h2>
        <p class="text-sm">
          A verification code has been sent to your email. Please enter the code below to
          verify this device.
        </p>
      </div>

      <Otp.Root class="flex flex-col items-center justify-center">
        <Otp.HiddenInput />

        <div class="otp-container flex flex-row justify-center gap-2">
          {slots.map((slot) => (
            <Otp.Item
              key={`otp-item-${slot}`}
              class={
                "h-9 w-10 border-2 text-center rounded data-[highlighted]:ring-qwik-blue-800 data-[highlighted]:ring-[3px] caret-blue-600"
              }
            >
              <Otp.ItemIndicator class="text-blue-500 text-xl animate-blink-caret">
                |
              </Otp.ItemIndicator>
            </Otp.Item>
          ))}
        </div>
      </Otp.Root>

      <TrustedCheckbox />

      <button
        type="button"
        class="rounded-md bg-qwik-blue-700 px-4 py-2 text-white outline-qwik-blue-600"
      >
        Sign in securely
      </button>
    </div>
  );
});

const InformationCircle = component$((props: PropsOf<"svg">) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Information Circle</title>
      <path
        d="M17.3333 21.3333H16V16H14.6667M16 10.6667H16.0133M28 16C28 17.5759 27.6896 19.1363 27.0866 20.5922C26.4835 22.0481 25.5996 23.371 24.4853 24.4853C23.371 25.5996 22.0481 26.4835 20.5922 27.0866C19.1363 27.6896 17.5759 28 16 28C14.4242 28 12.8637 27.6896 11.4078 27.0866C9.95191 26.4835 8.62904 25.5996 7.51473 24.4853C6.40043 23.371 5.51652 22.0481 4.91346 20.5922C4.3104 19.1363 4.00002 17.5759 4.00002 16C4.00002 12.8174 5.2643 9.76516 7.51473 7.51472C9.76517 5.26428 12.8174 4 16 4C19.1826 4 22.2349 5.26428 24.4853 7.51472C26.7357 9.76516 28 12.8174 28 16Z"
        stroke="#2563EB"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
});

export const TrustedCheckbox = component$(() => {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <div class="flex items-center gap-2">
        <Checkbox.Trigger
          class="size-[25px] rounded-lg relative bg-gray-500 
                     focus-visible:outline focus-visible:outline-1 focus-visible:outline-white
                     disabled:opacity-50 bg-qwik-neutral-200 data-[checked]:bg-qwik-blue-800 focus-visible:ring-[3px] ring-qwik-blue-600"
        >
          <Checkbox.Indicator
            class="data-[checked]:flex justify-center items-center absolute inset-0 
                      "
          >
            <LuCheck />
          </Checkbox.Indicator>
        </Checkbox.Trigger>
        <Checkbox.Label class="text-sm">
          This is a trusted device, don't ask again
        </Checkbox.Label>
      </div>
    </Checkbox.Root>
  );
});
