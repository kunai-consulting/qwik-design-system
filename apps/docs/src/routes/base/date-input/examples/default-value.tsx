import { $, component$, useSignal } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedDate = useSignal<DateInput.ISODate | null>();
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    selectedDate.value = date;
  });

  return (
    <div class="flex flex-col gap-10">
      <DateInput.Root
        class="w-full flex gap-2 max-w-[300px]"
        defaultDate="2022-02-22"
        onChange$={handleChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          The best date:
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root>

      <div>
        <p>Default value: 2022-02-22</p>
        <p>Selected date: {selectedDate.value}</p>
      </div>
    </div>
  );
});
