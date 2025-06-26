import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";
import { CalendarIcon } from "../shared/calendar-icon";
import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<Calendar.ISODate | null>(null);
  return (
    <Calendar.Root mode="popover" class="calendar-root">
      <div class="calendar-field-and-trigger">
        <Calendar.Field separator="." openCalendarOnClick>
          <Calendar.Day />
          <Calendar.Month />
          <Calendar.Year />
        </Calendar.Field>
        <Calendar.Trigger class="calendar-icon-trigger-button">
          <CalendarIcon />
        </Calendar.Trigger>
      </div>
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
