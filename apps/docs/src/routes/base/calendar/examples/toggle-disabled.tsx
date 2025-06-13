import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";
import { CalendarIcon } from "../shared/calendar-icon";
import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const isDisabled = useSignal(false);

  return (
    <div class="calendar-example-container">
      <Calendar.Root mode="popover" class="calendar-root" disabled={isDisabled.value}>
        <div class="calendar-field-and-trigger">
          <Calendar.Field separator="/">
            <Calendar.Month />
            <Calendar.Day />
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
            <Calendar.GridDay class="calendar-grid-day" />
          </Calendar.Grid>
        </Calendar.Content>
      </Calendar.Root>

      <div class="date-input-button-container">
        <button
          onClick$={() => (isDisabled.value = !isDisabled.value)}
          type="button"
          class="toggle-disabled-button"
        >
          Toggle disabled
        </button>
      </div>
    </div>
  );
});
