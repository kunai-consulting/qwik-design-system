import { DateInput } from "@kunai-consulting/qwik";
import { component$ } from "@qwik.dev/core";

export default component$(() => {
  return (
    <DateInput.Root>
      <DateInput.Label>When's your next pickleball match?</DateInput.Label>
      <DateInput.Field separator={<PickleballIcon />}>
        <DateInput.Month />
        <DateInput.Day />
        <DateInput.Year />
      </DateInput.Field>
    </DateInput.Root>
  );
});

const PickleballIcon = component$(() => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{
        display: "inline-block"
      }}
    >
      <path
        d="M8 4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V10C16 14.4183 12.4183 18 8 18V4Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <path
        d="M8 4V18C6.34315 18 5 16.6569 5 15V7C5 5.34315 6.34315 4 8 4Z"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linejoin="round"
      />
      <circle
        cx="12"
        cy="7"
        r="1.5"
        stroke="currentColor"
        stroke-width="1.5"
        fill="none"
      />
      <path
        d="M8 19V22"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
});
