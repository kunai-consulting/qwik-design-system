import { Slot, component$ } from "@builder.io/qwik";
import { useContext } from "@builder.io/qwik";
import {
  DateInputField,
  type PublicDateInputFieldProps
} from "../date-input/date-input-field";
import { DateInputRoot } from "../date-input/date-input-root";
import { calendarContextId } from "./calendar-context";

export const CalendarField = component$((props: PublicDateInputFieldProps) => {
  const context = useContext(calendarContextId);
  return (
    <DateInputRoot>
      <DateInputField {...props} bind:date={context.activeDate} data-qds-calendar-field>
        <Slot />
      </DateInputField>
    </DateInputRoot>
  );
});
