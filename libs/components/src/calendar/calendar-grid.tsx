import {
  $,
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useContext
} from "@builder.io/qwik";
import { calendarContextId } from "./calendar-context";
import type { ISODate, Month } from "./types";
type PublicCalendarGridProps = PropsOf<"div"> & {
  /** Event handler called when a date is selected */
  onDateChange$?: QRL<(date: ISODate) => void>;
};

const ACTION_KEYS = [
  "enter",
  " ",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
  "home",
  "end",
  "pageup",
  "pagedown"
] as const;

/** A component that renders the main calendar grid structure */
export const CalendarGrid = component$<PublicCalendarGridProps>((props) => {
  const context = useContext(calendarContextId);

  const decreaseDate = $(() => {
    const currentMonth = Number.parseInt(context.monthToRender.value);
    if (currentMonth === 1) {
      context.monthToRender.value = "12";
      context.yearToRender.value--;
      return;
    }

    context.monthToRender.value = String(currentMonth - 1).padStart(2, "0") as Month;
  });

  const increaseDate = $(() => {
    const currentMonth = Number.parseInt(context.monthToRender.value);
    if (currentMonth === 12) {
      context.monthToRender.value = "01";
      context.yearToRender.value++;
      return;
    }

    context.monthToRender.value = String(currentMonth + 1).padStart(2, "0") as Month;
  });

  const updateDateFocused = $((e: KeyboardEvent, gridBody: HTMLDivElement) => {
    if (!ACTION_KEYS.includes(e.key.toLowerCase() as (typeof ACTION_KEYS)[number]))
      return;
    const elFocus = document.activeElement;
    if (elFocus?.tagName.toLowerCase() !== "button") return;

    const buttons = Array.from(gridBody.getElementsByTagName("button"));
    const idx = buttons.indexOf(elFocus as HTMLButtonElement);
    const currentDate = elFocus?.getAttribute("data-value") as ISODate;
    const key = e.key.toLowerCase();

    const getNewIndex = (step: number) => {
      const newIdx = idx + step;
      if (newIdx < 0 || newIdx >= buttons.length) return idx;
      return buttons[newIdx].hasAttribute("disabled") ? idx : newIdx;
    };

    const handleDateChange = (step: number, newIdx: number) => {
      if (idx === newIdx) {
        const newDate = adjustDate(currentDate, { days: step });
        updateFocus(newIdx, newDate);
        step < 0 ? decreaseDate() : increaseDate();
      } else {
        updateFocus(newIdx);
      }
    };

    const adjustDate = (
      date: string,
      adjustment: {
        days?: number;
        months?: number;
      }
    ): ISODate => {
      const d = new Date(date);
      if (adjustment.days) d.setDate(d.getDate() + adjustment.days);
      if (adjustment.months) d.setMonth(d.getMonth() + adjustment.months);
      return d.toISOString().split("T")[0] as ISODate;
    };

    const updateFocus = (newIdx: number, newDate: ISODate | null = null) => {
      const dateToSet =
        newDate ?? (buttons[newIdx].getAttribute("data-value") as ISODate);
      context.dateToFocus.value = dateToSet;
      elFocus?.setAttribute("tabindex", "-1");
      buttons[newIdx].setAttribute("tabindex", "0");
      buttons[newIdx].focus({ preventScroll: true });
    };

    const handleMonthChange = (date: ISODate, currentMonth: string) => {
      if (date.split("-")[1] !== currentMonth) {
        date.split("-")[1] < currentMonth ? decreaseDate() : increaseDate();
      }
    };

    switch (key) {
      case "arrowup":
      case "arrowdown": {
        const step = key === "arrowup" ? -7 : 7;
        handleDateChange(step, getNewIndex(step));
        break;
      }

      case "arrowleft":
      case "arrowright": {
        const step = key === "arrowleft" ? -1 : 1;
        handleDateChange(step, getNewIndex(step));
        break;
      }

      case " ":
      case "enter": {
        (elFocus as HTMLButtonElement).click();
        break;
      }

      case "pageup":
      case "pagedown": {
        const step = key === "pageup" ? -1 : 1;
        const newDate = adjustDate(currentDate, { months: step });
        updateFocus(idx, newDate);
        step < 0 ? decreaseDate() : increaseDate();
        break;
      }

      case "home": {
        const rowStartIndex = Math.floor(idx / 7) * 7;
        const newDate = buttons[rowStartIndex].getAttribute("data-value") as ISODate;
        handleMonthChange(newDate, context.monthToRender.value);
        updateFocus(rowStartIndex, newDate);
        break;
      }

      case "end": {
        const rowEndIndex = Math.min(
          Math.ceil((idx + 1) / 7) * 7 - 1,
          buttons.length - 1
        );
        const newDate = buttons[rowEndIndex].getAttribute("data-value") as ISODate;
        handleMonthChange(newDate, context.monthToRender.value);
        updateFocus(rowEndIndex, newDate);
        break;
      }
    }
  });

  const { onDateChange$, ...divProps } = props;

  return (
    // The main calendar grid container
    <div
      data-qds-calendar-grid
      role="grid"
      {...divProps}
      data-show-week-numbers={context.showWeekNumber ? "true" : "false"}
    >
      {context.showDaysOfWeek && (
        // The header section of the calendar grid
        // biome-ignore lint/a11y/useFocusableInteractive: The header section contains no elements that a user needs to interact with or focus on.
        <div data-qds-calendar-grid-header-row role="row">
          {context.showWeekNumber && (
            <div role="columnheader" data-qds-calendar-grid-header-cell>
              Wk
            </div>
          )}
          {context.daysOfWeek.map((day) => (
            <div
              key={day}
              role="columnheader"
              aria-label={day}
              // A cell in the calendar grid header
              data-qds-calendar-grid-header-cell
            >
              {day.slice(0, 2).normalize("NFD").replace(/\p{M}/gu, "")}
            </div>
          ))}
        </div>
      )}
      <div
        // The body section of the calendar grid
        data-qds-calendar-grid-body
        preventdefault:keydown
        onKeyDown$={[
          $((e: KeyboardEvent, target: HTMLDivElement) => {
            updateDateFocused(e, target);
          })
        ]}
      >
        <Slot />
      </div>
    </div>
  );
});
