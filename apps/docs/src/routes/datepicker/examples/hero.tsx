import { $, component$, useSignal } from "@builder.io/qwik";

import { Datepicker } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedDate = useSignal<`${number}-${number}-${number}`>();

  return (
    <div class="flex flex-col gap-10">
    <Datepicker.Root class='w-full flex flex-col gap-2 max-w-[300px]'>
      <Datepicker.Header class="flex items-center justify-between">
        <Datepicker.Previous class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md"/>
        <Datepicker.Title />
        <Datepicker.Next class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md"/>
      </Datepicker.Header>
      <Datepicker.Grid
        class="w-full items-center"
        buttonProps={{
          class: "size-10 data-[selected]:border data-[current]:border-dashed data-[current]:border data-[current]:rounded-md data-[selected]:rounded-md"
        }}
        onDateChange$={$((date) => {
          console.log("Date changed:", date);
          selectedDate.value = date;
        })}
      />
    </Datepicker.Root>

    <div>
        <p>Selected date: {selectedDate.value}</p>
      </div>
    </div>
  );
});
