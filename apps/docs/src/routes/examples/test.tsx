import { component$, PropsOf } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';

import { fromTheme } from 'tailwind-merge';
import {
  OtpRoot,
  OtpItem,
  OtpNativeInput,
} from '../../../../../libs/components/src/otp';

export const head: DocumentHead = {
  title: 'Qwik Design System',
  meta: [
    {
      name: 'description',
      content: 'Qwik Design System',
    },
  ],
};

export default component$(() => {
  return (
    <div class="mt-10 flex justify-center">
      <div class="flex flex-col items-center justify-center gap-4">
        <OtpRoot class="flex flex-col items-center justify-center gap-4">
          <OtpNativeInput />
          <div class="otp-container flex flex-row justify-center gap-2">
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
            <OtpItem class="h-9 w-10 border-2 text-center data-[highlighted]:border-blue-200" />
          </div>
          <div class="mt-6 flex flex-row justify-center gap-2">
            <input
              type="checkbox"
              class="text-cool-700 form-checkbox text-sm"
            />
            This is a trusted device, don't ask again
          </div>
        </OtpRoot>
      </div>
    </div>
  );
});

const InformationCircle = component$((props: PropsOf<'svg'>) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
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
