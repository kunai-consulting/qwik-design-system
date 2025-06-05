import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<`${number}-${number}-${number}`>();

  return (
    <div class="calendar-example-container">
      <Calendar.Root class="calendar-root">
        <Calendar.Content>
          <Calendar.Header class="calendar-header">
            <Calendar.Previous />
            <Calendar.Title />
            <Calendar.Next />
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

      <div>
        <p>Selected date: {selectedDate.value}</p>
      </div>
    </div>
  );
});
