import { $, Component, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { ARIA_LABELS } from "./constants";
import { calendarContextId } from "./calendar-context";
import type { Month } from "./types";

type CalendarPreviousProps = PropsOf<"button"> & {
    icon?: Component<PropsOf<'svg'>>
}

export const CalendarPrevious = component$((props: CalendarPreviousProps) => {
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

  const Icon = props.icon ?? (component$(() => {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        fill="currentColor"
        viewBox="0 0 256 256"
        class="size-6"
      >
        <rect width="256" height="256" fill="none" />
        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
      </svg>
    )
  }))
  
  return (
    <button
      data-qds-datepicker-previous
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
      <Icon />
    </button>
  );
});
