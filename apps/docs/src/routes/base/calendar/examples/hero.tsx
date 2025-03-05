import { $, component$, useSignal } from "@builder.io/qwik";

import { Calendar } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedDate = useSignal<`${number}-${number}-${number}`>();

  return (
    <div class="flex flex-col gap-10">
      <Calendar.Root class="w-full flex flex-col gap-2 max-w-[300px]">
        <Calendar.Header class="flex items-center justify-between">
          <Calendar.Previous class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md" />
          <Calendar.Title />
          <Calendar.Next class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md" />
        </Calendar.Header>
        <Calendar.Grid class="w-full items-center">
          <Calendar.GridDay
            class="size-10 data-[selected]:border data-[current]:border-dashed data-[current]:border data-[current]:rounded-md data-[selected]:rounded-md"
            onDateChange$={$((date) => {
              console.log("Date changed:", date);
              selectedDate.value = date;
            })}
          />
        </Calendar.Grid>
      </Calendar.Root>

      <div>
        <p>Selected date: {selectedDate.value}</p>
      </div>
    </div>
  );
});
