import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";
import { DocsSwitch } from "../../../../docs-widgets/switch/switch";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<Calendar.ISODate | null>(null);

  // Prop values
  const disabled = useSignal(false);
  const fullWeeks = useSignal(false);
  const showDaysOfWeek = useSignal(true);
  const showWeekNumbers = useSignal(true);

  return (
    <div class="flex gap-4">
      <div class="calendar-example-container">
        <Calendar.Root
          class="calendar-root"
          disabled={disabled.value}
          fullWeeks={fullWeeks.value}
          showDaysOfWeek={showDaysOfWeek.value}
          showWeekNumber={showWeekNumbers.value}>
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

        <div>
          <p>Selected date: {selectedDate.value}</p>
        </div>
      </div>
      <div class="flex flex-col gap-2">
        <DocsSwitch value={disabled} label="Disabled" />
        <DocsSwitch value={fullWeeks} label="Full Weeks" />
        <DocsSwitch value={showDaysOfWeek} label="Show Days of Week" />
        <DocsSwitch value={showWeekNumbers} label="Show Week Numbers" />
      </div>
    </div>
  );
});
