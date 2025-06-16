import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";
import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";

export default component$(() => {
  useStyles$(styles);
  const open = useSignal(false);
  return (
    <div class="calendar-example-container">
      <div style={{ display: "flex", gap: "20px" }}>
        <button
          onClick$={() => {
            open.value = !open.value;
          }}
          type="button"
          data-qds-calendar-test-external-toggle
        >
          Toggle popover from outside
        </button>
        <span>
          Open status:{" "}
          <span data-qds-calendar-test-open-status>{open.value ? "open" : "closed"}</span>
        </span>
      </div>
      <Calendar.Root mode="popover" bind:open={open} class="calendar-root">
        <Calendar.Trigger>Trigger</Calendar.Trigger>
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
    </div>
  );
});
