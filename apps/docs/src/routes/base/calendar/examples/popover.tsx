import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<`${number}-${number}-${number}`>();
  return (
    <Calendar.Root mode="popover" class="calendar-root">
      <Calendar.Trigger>Trigger</Calendar.Trigger>
      <Calendar.Content>
        <Calendar.Header class="calendar-header">
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
      </Calendar.Content>
    </Calendar.Root>
  );
});
