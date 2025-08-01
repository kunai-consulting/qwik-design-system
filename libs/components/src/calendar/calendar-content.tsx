import { Slot, component$, useStyles$ } from "@qwik.dev/core";
import { useContext } from "@qwik.dev/core";
import { PopoverContent } from "../popover/popover-content";
import { Render } from "../render/render";
import styles from "./calendar-content.css?inline";
import { calendarContextId } from "./calendar-context";

export const CalendarContent = component$(() => {
  useStyles$(styles);
  const context = useContext(calendarContextId);
  const mode = context.mode;

  if (mode === "popover") {
    return (
      <PopoverContent data-qds-calendar-content data-qds-calendar-popover-content>
        <Slot />
      </PopoverContent>
    );
  }
  return (
    <Render fallback="div" data-qds-calendar-content data-qds-calendar-inline-content>
      <Slot />
    </Render>
  );
});
