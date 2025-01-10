import { $, component$ } from "@builder.io/qwik";

import { Datepicker } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Datepicker.Root>
      <Datepicker.Header class="flex items-center justify-between">
        <Datepicker.Previous class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md"/>
        <Datepicker.Title />
        <Datepicker.Next class="flex w-[20px] h-[20px] items-center justify-center border border-white rounded-md"/>
      </Datepicker.Header>
      <Datepicker.Grid
        onDateChange$={$((date) => {
          console.log("Date changed:", date);
        })}
      />
    </Datepicker.Root>
  );
});
