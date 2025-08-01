import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { calendarContextId } from "./calendar-context";
import { ARIA_LABELS } from "./constants";
import type { Month } from "./types";

/** A button component that handles navigation to the next month */
export const CalendarNext = component$((props: PropsOf<"button">) => {
  const context = useContext(calendarContextId);
  const { monthToRender, yearToRender, dateToFocus, locale } = context;
  const increaseDate = $(() => {
    if (monthToRender.value === "12") {
      monthToRender.value = "01";
      yearToRender.value += 1;
      return;
    }

    monthToRender.value = String(+monthToRender.value + 1).padStart(2, "0") as Month;
  });

  return (
    <button
      // The next month navigation button
      data-qds-calendar-next
      type="button"
      {...props}
      onClick$={[
        increaseDate,
        $(() => {
          dateToFocus.value = `${yearToRender.value}-${monthToRender.value}-01`;
        })
      ]}
      aria-label={ARIA_LABELS[locale].next}
    >
      <Slot />
    </button>
  );
});
