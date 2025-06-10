import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<`${number}-${number}-${number}`>();
  return (
    <Calendar.Root mode="inline" showWeekNumber class="calendar-root">
      <Calendar.Content>
        <Calendar.Header class="calendar-header">
          <Calendar.Previous class="calendar-header-button">
            <PreviousIcon />
          </Calendar.Previous>
          <Calendar.Title />
          <Calendar.Next class="calendar-header-button">
            <NextIcon />
          </Calendar.Next>
        </Calendar.Header>
        <Calendar.Grid>
          <Calendar.GridDay
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
