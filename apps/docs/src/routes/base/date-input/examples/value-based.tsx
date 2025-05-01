import { $, component$, useSignal } from "@builder.io/qwik";
import { useStylesScoped$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";
import styles from "./date-input.css?inline";

export default component$(() => {
  useStylesScoped$(styles);
  const selectedDate = useSignal<DateInput.ISODate | null>("2021-01-01");
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    selectedDate.value = date;
  });

  return (
    <div class="flex flex-col gap-10">
      <DateInput.Root
        class="w-full flex gap-2 max-w-[300px]"
        date={selectedDate.value}
        onChange$={handleChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          Choose your date:
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root>

      <p>
        Selected date: <span class="external-value">{selectedDate.value}</span>
      </p>

      <div class="flex gap-2">
        <button
          onClick$={() =>
            (selectedDate.value = new Date()
              .toISOString()
              .split("T")[0] as DateInput.ISODate)
          }
          type="button"
          class="set-value-button"
        >
          Set to today
        </button>
        <button
          onClick$={() => (selectedDate.value = null)}
          type="button"
          class="set-null-button"
        >
          Clear
        </button>
      </div>
    </div>
  );
});
