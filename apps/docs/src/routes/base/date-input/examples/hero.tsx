import { component$, useSignal } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedDate = useSignal<DateInput.ISODate | null>(null);

  return (
    <div class="flex flex-col gap-10">
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        format="yyyy-mm-dd"
        bind:date={selectedDate}
      >
        <DateInput.Label class="flex items-center justify-between">
          My date input
        </DateInput.Label>
        <DateInput.DateEntry />

        <DateInput.HiddenInput name="date" value={selectedDate.value} />
      </DateInput.Root>

      <div>
        <p>
          Selected date: <span class="external-value">{selectedDate.value}</span>
        </p>
      </div>
    </div>
  );
});
