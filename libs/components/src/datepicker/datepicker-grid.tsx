import { component$, useContext, $, PropsOf, QRL } from "@builder.io/qwik";
import { datepickerContextId } from "./datepicker-context";
import { LocalDate, Locale, Month } from "./types";
import { getWeekNumber } from "./utils/get-week-number";

type DatePickerGridProps = {
    calendarProps?: PropsOf<'table'>;
    cellProps?: PropsOf<'td'>;
    theadProps?: PropsOf<'thead'>;
    theadRowProps?: PropsOf<'tr'>;
    headerCellProps?: PropsOf<'th'>;
    tbodyProps?: PropsOf<'tbody'>;
    tbodyRowProps?: PropsOf<'tr'>;
    weekNumberProps?: PropsOf<'td'>;
    dayButtonProps?: PropsOf<'button'>;
    onDateChange$?: QRL<(date: LocalDate) => void>;
  }

  const ACTION_KEYS = [
    'enter',
    ' ',
    'arrowup',
    'arrowdown',
    'arrowleft',
    'arrowright',
    'home',
    'end',
    'pageup',
    'pagedown',
  ] as const;   

  const dateFormatter = (locale: Locale) =>
    new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

export const DatePickerGrid = component$<DatePickerGridProps>((props) => {
    const context = useContext(datepickerContextId);
  
    const decreaseDate = $(() => {
      if (context.monthToRender.value === '01') {
        context.monthToRender.value = '12';
        context.yearToRender.value -= 1;
        return;
      }
  
      context.monthToRender.value = String(+context.monthToRender.value - 1).padStart(2, '0') as Month;
    });
    const increaseDate = $(() => {
      if (context.monthToRender.value === '12') {
        context.monthToRender.value = '01';
        context.yearToRender.value += 1;
        return;
      }
  
      context.monthToRender.value = String(+context.monthToRender.value + 1).padStart(2, '0') as Month;
    });
  
    const updateDateFocused = $((e: KeyboardEvent, tbody: HTMLTableSectionElement) => {
      if (!ACTION_KEYS.includes(e.key.toLowerCase() as (typeof ACTION_KEYS)[number])) return;
  
      const elFocus = document.activeElement;
  
      if (elFocus?.tagName.toLowerCase() !== 'button') return;
  
      const buttons = Array.from(tbody.getElementsByTagName('button'));
  
      const getNewIndex = ({ currentIdx, step }: { currentIdx: number; step: number }) => {
        const newIdx = currentIdx + step;
  
        if (newIdx < 0 || newIdx >= buttons.length) return currentIdx;
  
        const btn = buttons[newIdx];
  
        if (btn.hasAttribute('disabled')) return currentIdx;
  
        return newIdx;
      };
  
      const idx = buttons.indexOf(elFocus as HTMLButtonElement);
  
      // local helpers
      let localIdx: number = idx;
      let newDate: LocalDate | null = null;
  
      switch (e.key.toLowerCase()) {
        case 'arrowup': {
          localIdx = getNewIndex({ currentIdx: idx, step: -7 });
          if (idx === localIdx) {
            const d = new Date(elFocus.getAttribute('data-value') as LocalDate);
            newDate = new Date(d.setDate(d.getDate() - 7)).toISOString().split('T')[0] as LocalDate;
  
            decreaseDate();
          }
          break;
        }
        case 'arrowdown': {
          localIdx = getNewIndex({ currentIdx: idx, step: 7 });
          if (idx === localIdx) {
            const d = new Date(elFocus.getAttribute('data-value') as LocalDate);
            newDate = new Date(d.setDate(d.getDate() + 7)).toISOString().split('T')[0] as LocalDate;
  
            increaseDate();
          }
  
          break;
        }
        case 'arrowleft': {
          localIdx = getNewIndex({ currentIdx: idx, step: -1 });
          if (idx === localIdx) {
            const d = new Date(elFocus.getAttribute('data-value') as LocalDate);
            newDate = new Date(d.setDate(d.getDate() - 1)).toISOString().split('T')[0] as LocalDate;
  
            decreaseDate();
          }
          break;
        }
        case 'arrowright': {
          localIdx = getNewIndex({ currentIdx: idx, step: 1 });
          if (idx === localIdx) {
            const d = new Date(elFocus.getAttribute('data-value') as LocalDate);
            newDate = new Date(d.setDate(d.getDate() + 1)).toISOString().split('T')[0] as LocalDate;
  
            increaseDate();
          }
          break;
        }
        case ' ':
        case 'enter': {
          (elFocus as HTMLButtonElement).click();
          break;
        }
        case 'pageup': {
          const localDate = elFocus.getAttribute('data-value') as LocalDate;
          const d = new Date(localDate);
          newDate = new Date(d.setMonth(d.getMonth() - 1)).toISOString().split('T')[0] as LocalDate;
  
          decreaseDate();
          break;
        }
        case 'pagedown': {
          const localDate = elFocus.getAttribute('data-value') as LocalDate;
          const d = new Date(localDate);
          newDate = new Date(d.setMonth(d.getMonth() + 1)).toISOString().split('T')[0] as LocalDate;
  
          increaseDate();
          break;
        }
        case 'home': {
          // Find the start of the current row
          const rowStartIndex = Math.floor(idx / 7) * 7;
          const startButton = buttons[rowStartIndex];
          newDate = startButton.getAttribute('data-value') as LocalDate;
  
          // Check if the start of the row is in the previous month
          if (newDate.split('-')[1] !== context.monthToRender.value) {
            decreaseDate();
          }
  
          localIdx = rowStartIndex;
          break;
        }
        case 'end': {
          // Find the end of the current row
          const rowEndIndex = Math.min(Math.ceil((idx + 1) / 7) * 7 - 1, buttons.length - 1);
          const endButton = buttons[rowEndIndex];
          newDate = endButton.getAttribute('data-value') as LocalDate;
  
          // Check if the end of the row is in the next month
          if (newDate.split('-')[1] !== context.monthToRender.value) {
            increaseDate();
          }
  
          localIdx = rowEndIndex;
          break;
        }
      }
  
      context.dateToFocus.value = newDate ?? (buttons[localIdx].getAttribute('data-value') as LocalDate);
      elFocus.setAttribute('tabindex', '-1');
      buttons[localIdx].setAttribute('tabindex', '0');
      // @ts-expect-error
      buttons[localIdx].focus({ preventScroll: true, focusVisible: true });
    });
  
    return (
      <table tabIndex={-1} role='grid' {...props.calendarProps}>
            {context.showDaysOfWeek && (
              <thead {...props.theadProps}>
                <tr {...props.theadRowProps}>
                  {context.showWeekNumber && <td />}
                  {context.daysOfWeek.map((day) => (
                    <th key={day} scope='col' aria-label={day} {...props.headerCellProps}>
                      {
                        day
                          .slice(0, 2)
                          .normalize('NFD')
                          .replace(/\p{M}/gu, '') // remove accents, special things on letters, etc.
                      }
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody
              {...props.tbodyProps}
              preventdefault:keydown
              onKeyDown$={[
                $((e: KeyboardEvent, target: HTMLTableSectionElement) => {
                  updateDateFocused(e, target);
                }),
                props.tbodyProps?.onKeyDown$,
              ]}
            >
              {context.datesArray.value.map((week) => {
                return (
                  <tr key={week.toString()} {...props.tbodyRowProps}>
                    {context.showWeekNumber && (
                      <td {...props.weekNumberProps}>
                        <span>
                          {week.find((day): day is string => day !== null)
                            ? getWeekNumber(week.find((day): day is string => day !== null)!).toString()
                            : ''}
                        </span>
                      </td>
                    )}
                    {week.map((day) => {
                      const label = day ? dateFormatter(context.locale).format(new Date(`${day}T12:00:00`)) : undefined; // the T12:00:00 is to avoid timezone issues
                      const disabled = day?.split('-')[1] !== context.monthToRender.value;
  
                      return (
                        <td key={`${week.toString()}-${day}`} role='presentation' aria-disabled={disabled} {...props.cellProps}>
                          {day && (
                            <button
                              type='button'
                              data-preselected={day === context.defaultDate.value}
                              aria-selected={day === context.activeDate.value ? 'true' : undefined}
                              data-value={day}
                              aria-label={label}
                              disabled={disabled}
                              tabIndex={day === context.dateToFocus.value ? 0 : -1}
                              {...props.dayButtonProps}
                              onClick$={[
                                $(() => {
                                  context.activeDate.value = day as LocalDate;
                                  props.onDateChange$?.(day as LocalDate);
                                }),
                                props.dayButtonProps?.onClick$,
                              ]}
                            >
                              {day.split('-')[2]}
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
    );
  });