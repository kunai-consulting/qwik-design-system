import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { MONTHS_LG } from "./constants";
import { datepickerContextId } from "./datepicker-context";

export const DatePickerTitle = component$((props: PropsOf<"div">) => {
  const context = useContext(datepickerContextId);
  const { monthToRender, yearToRender, locale } = context;
  const month = MONTHS_LG[locale][+monthToRender.value - 1];
  const title = `${month} ${yearToRender.value}`;

  return (
    <div data-qds-datepicker-title aria-live="polite" role="presentation" {...props}>
      {title}
    </div>
  );
});
