import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const selectedDate = useSignal<Calendar.ISODate | null>(null);
  const open = useSignal(false);
  return (
    <div class="calendar-example-container">
      <div style={ { display: "flex", gap: "20px" }}>
        <button
          onClick$={() => {
            open.value = !open.value;
          }}
          type="button"
        >
          Toggle popover from outside
        </button>
        <span>Open status: {open.value ? "open" : "closed"}</span>
      </div>
      <Calendar.Root
        mode="popover"
        bind:open={open}
        class="calendar-root"
        onChange$={$((date) => {
          console.log("Date changed:", date);
          selectedDate.value = date;
        })}
      >
        <Calendar.Trigger>Trigger</Calendar.Trigger>
        <Calendar.Content>
          <Calendar.Header class="calendar-header">
            <Calendar.Previous class="calendar-header-button" />
            <Calendar.Title />
            <Calendar.Next class="calendar-header-button" />
          </Calendar.Header>
          <Calendar.Grid class="calendar-grid">
            <Calendar.GridDay
              class="calendar-grid-day"
              onDateChange$={$((date) => {
                console.log("Date changed:", date);
              })}
            />
          </Calendar.Grid>
        </Calendar.Content>
      </Calendar.Root>
    </div>
  );
});
