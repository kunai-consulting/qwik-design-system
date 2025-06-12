import { $, Slot, component$ } from "@builder.io/qwik";
import { useContext, useStyles$ } from "@builder.io/qwik";
import {
  DateInputField,
  type PublicDateInputFieldProps
} from "../date-input/date-input-field";
import { DateInputRoot } from "../date-input/date-input-root";
import { calendarContextId } from "./calendar-context";
import styles from "./calendar-field.css?inline";

type PublicCalendarFieldProps = PublicDateInputFieldProps & {
  openCalendarOnClick?: boolean;
};

export const CalendarField = component$(
  ({ openCalendarOnClick = false, ...props }: PublicCalendarFieldProps) => {
    useStyles$(styles);
    const context = useContext(calendarContextId);

    const handleClick$ = $(() => {
      // This handler is for the click shield to toggle the popover
      if (openCalendarOnClick && !context.disabledSig.value) {
        context.isPopoverOpenSig.value = !context.isPopoverOpenSig.value;
      }
    });

    return (
      <DateInputRoot data-qds-calendar-field-input-root>
        <DateInputField
          {...props}
          bind:date={context.activeDate}
          disabled={context.disabledSig.value || openCalendarOnClick}
          data-qds-calendar-field
        >
          <Slot />
        </DateInputField>
        {openCalendarOnClick && (
          <div data-qds-calendar-field-click-shield onClick$={handleClick$} />
        )}
      </DateInputRoot>
    );
  }
);
