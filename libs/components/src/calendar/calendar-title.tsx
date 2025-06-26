import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { calendarContextId } from "./calendar-context";
import { MONTHS_LG } from "./constants";

/** A component that displays the current month and year */
export const CalendarTitle = component$((props: PropsOf<"div">) => {
  const context = useContext(calendarContextId);
  const { monthToRender, yearToRender, locale } = context;
  const month = MONTHS_LG[locale][+monthToRender.value - 1];
  const title = `${month} ${yearToRender.value}`;

  return (
    // The title component showing current month and year
    <div data-qds-calendar-title aria-live="polite" role="presentation" {...props}>
      {title}
    </div>
  );
});
