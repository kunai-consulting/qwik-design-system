import { component$, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
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
        <Calendar.Grid class="calendar-grid">
          <Calendar.GridDay class="calendar-grid-day" />
        </Calendar.Grid>
      </Calendar.Content>
    </Calendar.Root>
  );
});
