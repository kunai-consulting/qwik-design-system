import { $, component$, useSignal } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedDate = useSignal<DateInput.ISODate | null>();
  const numChanges = useSignal(0);
  const handleChange$ = $((date: DateInput.ISODate | null) => {
    numChanges.value++;
    selectedDate.value = date;
  });

  return (
    <div class="flex flex-col gap-10">
      <DateInput.Root
        class="w-full flex flex-col gap-2 max-w-[300px]"
        onChange$={handleChange$}
      >
        <DateInput.Label class="flex items-center justify-between">
          My date input
        </DateInput.Label>
        <DateInput.DateEntry />
      </DateInput.Root>

      <div>
        <p>Selected date: {selectedDate.value}</p>
        <p>Times changed: {numChanges.value}</p>
      </div>
    </div>
  );
});
