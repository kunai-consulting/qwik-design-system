import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { calendarContextId } from "./calendar-context";
import { MONTHS_LG } from "./constants";

export const CalendarTitle = component$((props: PropsOf<"div">) => {
  const context = useContext(calendarContextId);
  const { monthToRender, yearToRender, locale } = context;
  const month = MONTHS_LG[locale][+monthToRender.value - 1];
  const title = `${month} ${yearToRender.value}`;

  return (
    <div data-qds-datepicker-title aria-live="polite" role="presentation" {...props}>
      {title}
    </div>
  );
});
