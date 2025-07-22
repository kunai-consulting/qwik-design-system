import { $, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Calendar } from "@kunai-consulting/qwik";
import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<Calendar.ISODate | null>(null);
  return (
    <Calendar.Root mode="inline" class="calendar-root">
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
        <Calendar.Grid class="calendar-grid">
          <Calendar.GridDay
            class="calendar-grid-day"
            showLeadingZeros
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
