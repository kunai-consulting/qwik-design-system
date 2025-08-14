import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Calendar } from "@kunai-consulting/qwik";

import { NextIcon } from "../shared/next-icon";
import { PreviousIcon } from "../shared/previous-icon";
import styles from "./calendar.css?inline";
import { DocsSwitch } from "../../../../docs-widgets/switch/switch";
import { DocsToggleGroup } from "../../../../docs-widgets/toggle-group/toggle-group";
import { CalendarIcon } from "../shared/calendar-icon";
import { ExampleContainer } from "../../../../docs-widgets/example-container/example-container";

export default component$(() => {
  useStyles$(styles);

  // Primary data
  const selectedDate = useSignal<Calendar.ISODate | null>(null);

  // Props
  const mode = useSignal<"inline" | "popover">("inline");
  const disabled = useSignal(false);
  const fullWeeks = useSignal(false);
  const showDaysOfWeek = useSignal(false);
  const showWeekNumbers = useSignal(false);
  const open = useSignal(false);

  return (
    <ExampleContainer>
      <div class="flex flex-col gap-4" q:slot="example">
        <Calendar.Root
          class="calendar-root"
          bind:date={selectedDate}
          // props
          bind:mode={mode}
          bind:disabled={disabled}
          bind:fullWeeks={fullWeeks}
          bind:showDaysOfWeek={showDaysOfWeek}
          bind:showWeekNumber={showWeekNumbers}
          bind:open={open}
        >
          {mode.value === "popover" && <div class="calendar-field-and-trigger">
            <Calendar.Field separator="/">
              <Calendar.Month/>
              <Calendar.Day/>
              <Calendar.Year/>
            </Calendar.Field>
            <Calendar.Trigger class="calendar-icon-trigger-button">
              <CalendarIcon/>
            </Calendar.Trigger>
          </div>}
          <Calendar.Content>
            <Calendar.Header class="calendar-header">
              <Calendar.Previous class="calendar-header-button">
                <PreviousIcon/>
              </Calendar.Previous>
              <Calendar.Title/>
              <Calendar.Next class="calendar-header-button">
                <NextIcon/>
              </Calendar.Next>
            </Calendar.Header>
            <Calendar.Grid class="calendar-grid">
              <Calendar.GridDay
                class="calendar-grid-day"
              />
            </Calendar.Grid>
          </Calendar.Content>
        </Calendar.Root>

        <div>
          <p>Selected date: {selectedDate.value}</p>
        </div>
      </div>

      <div class="flex flex-col gap-2" q:slot="props">
        <DocsToggleGroup value={mode} items={[{value: "inline"}, {value: "popover"}]}/>
        {mode.value === "popover" && <DocsSwitch value={open} label="Open"/>}
        <DocsSwitch value={disabled} label="Disabled"/>
        <DocsSwitch value={fullWeeks} label="Full Weeks" />
        <DocsSwitch value={showDaysOfWeek} label="Show Days of Week" />
        <DocsSwitch value={showWeekNumbers} label="Show Week Numbers" />
      </div>
    </ExampleContainer>
  );
});
