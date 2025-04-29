import { component$, useSignal } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";
import styles from "./date-input.css?inline";

export default component$(() => {
  useStyles$(styles);
  const boundDate = useSignal<DateInput.ISODate | null>("1999-12-31");

  return (
    <div class="flex flex-col gap-10">
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        bind:date={boundDate}
      >
        <DateInput.Label class="flex items-center justify-between">
          Party like it's:
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root>
      <p>Bound date: {boundDate.value}</p>
      <div class="flex gap-2">
        <button onClick$={() => (boundDate.value = "2099-12-31")} type="button">
          Set to 2099-12-31
        </button>
        <button onClick$={() => (boundDate.value = null)} type="button">
          Clear
        </button>
      </div>
    </div>
  );
});
