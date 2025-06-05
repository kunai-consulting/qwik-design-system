import { Slot, component$ } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { PopoverContentBase } from "../popover/popover-content";
import { Render } from "../render/render";
import { calendarContextId } from "./calendar-context";

export const CalendarContentBase = component$(() => {
  const context = useContext(calendarContextId);
  const mode = context.mode;

  if (mode === "popover") {
    return (
      <PopoverContentBase>
        <Slot />
      </PopoverContentBase>
    );
  }
  return (
    <Render fallback="div">
      <Slot />
    </Render>
  );
});

export const CalendarContent = withAsChild(CalendarContentBase);
