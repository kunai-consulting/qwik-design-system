import { $, type HTMLElementAttrs, Slot, component$, useContext } from "@qwik.dev/core";
import { calendarContextId } from "./calendar-context";
import { ARIA_LABELS } from "./constants";
import type { Month } from "./types";

/** A button component that handles navigation to the previous month */
export const CalendarPrevious = component$((props: HTMLElementAttrs<"button">) => {
  const context = useContext(calendarContextId);
  const { monthToRender, yearToRender, dateToFocus, locale } = context;
  const decreaseDate = $(() => {
    if (monthToRender.value === "01") {
      monthToRender.value = "12";
      yearToRender.value -= 1;
      return;
    }

    monthToRender.value = String(+monthToRender.value - 1).padStart(2, "0") as Month;
  });

  return (
    <button
      // The previous month navigation button
      data-qds-calendar-previous
      type="button"
      onClick$={[
        decreaseDate,
        $(() => {
          dateToFocus.value = `${yearToRender.value}-${monthToRender.value}-01`;
        })
      ]}
      aria-label={ARIA_LABELS[locale].previous}
      {...props}
    >
      <Slot />
    </button>
  );
});
