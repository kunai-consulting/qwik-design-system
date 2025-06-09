import { Slot, component$, useStyles$ } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { Render } from "../render/render";
import styles from "./calendar-content.css?inline";
import { calendarContextId } from "./calendar-context";

export const CalendarContentBase = component$(() => {
  useStyles$(styles);
  const context = useContext(calendarContextId);
  const mode = context.mode;

  if (mode === "popover") {
    return (
      <PopoverContentBase data-qds-calendar-content data-qds-calendar-popover-content>
        <Slot />
      </PopoverContentBase>
    );
  }
  return (
    <Render fallback="div" data-qds-calendar-content data-qds-calendar-inline-content>
      <Slot />
    </Render>
  );
});

export const CalendarContent = withAsChild(CalendarContentBase);
