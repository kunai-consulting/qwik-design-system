import { component$, useSignal } from "@builder.io/qwik";
import { useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";
import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<Calendar.ISODate | null>("1999-12-31");

  return (
    <div class="calendar-example-container">
      <Calendar.Root class="calendar-root" bind:date={selectedDate}>
        <Calendar.Field>
          <Calendar.Month />
          <span>/</span>
          <Calendar.Day />
          <span>/</span>
          <Calendar.Year />
        </Calendar.Field>
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
            <Calendar.GridDay class="calendar-grid-day" />
          </Calendar.Grid>
        </Calendar.Content>
      </Calendar.Root>
      <hr />
      <p>
        Bound date: <span class="external-value">{selectedDate.value}</span>
      </p>
      <div class="date-input-button-container">
        <button
          onClick$={() => (selectedDate.value = "3000-01-01")}
          type="button"
          class="set-value-button"
        >
          Set to 3000-01-01
        </button>
        <button
          onClick$={() => (selectedDate.value = null)}
          type="button"
          class="set-null-button"
        >
          Clear
        </button>
      </div>
    </div>
  );
});
