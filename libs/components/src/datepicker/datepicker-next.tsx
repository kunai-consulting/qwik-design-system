import { $, Component, type PropsOf, component$, useContext } from "@builder.io/qwik";
import { ARIA_LABELS } from "./constants";
import { datepickerContextId } from "./datepicker-context";
import type { Month } from "./types";

type DatePickerNextProps = PropsOf<"button"> & {
    icon?: Component<PropsOf<'svg'>>
}

export const DatePickerNext = component$((props: DatePickerNextProps) => {
  const context = useContext(datepickerContextId);
  const { monthToRender, yearToRender, dateToFocus, locale } = context;
  const increaseDate = $(() => {
    if (monthToRender.value === "12") {
      monthToRender.value = "01";
      yearToRender.value += 1;
      return;
    }

    monthToRender.value = String(+monthToRender.value + 1).padStart(2, "0") as Month;
  });

  const Icon = props.icon ?? (component$(() => {
    return <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor"
    viewBox="0 0 256 256"
    class="size-6"
  >
    <rect width="256" height="256" fill="none" />
    <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
  </svg>
  }))

  return (
    <button
      data-qds-datepicker-next
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
      <Icon />
    </button>
  );
});
