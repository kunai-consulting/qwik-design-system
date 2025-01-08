import {
  $,
  type Component,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';

import { ChevronLeft, ChevronRight } from './icons';
import { LocalDate, Locale, Month } from './types';
import { ARIA_LABELS, MONTHS_LG, WEEKDAYS } from './constants';
import { daysArrGenerator } from './utils/date-generator';
import { DatepickerContext } from './datepicker-context';
import { datepickerContextId } from './datepicker-context';

export interface DatePickerRootProps {
  locale?: Locale;
  showWeekNumber?: boolean;
  fullWeeks?: boolean;
  date?: LocalDate;
  'bind:date'?: Signal<LocalDate>;
  showDaysOfWeek?: boolean;
  unStyled?: boolean;
  iconLeft?: Component<PropsOf<'svg'>>;
  iconRight?: Component<PropsOf<'svg'>>;
  // props to override
  containerProps?: PropsOf<'div'>;
  headerProps?: PropsOf<'header'>;
  actionButtonProps?: PropsOf<'button'>;
  actionLeftProps?: PropsOf<'button'>;
  actionRightProps?: PropsOf<'button'>;
  iconProps?: PropsOf<'svg'>;
  titleProps?: PropsOf<'div'>;
  calendarProps?: PropsOf<'table'>;
  theadProps?: PropsOf<'thead'>;
  tbodyProps?: PropsOf<'tbody'>;
  theadRowProps?: PropsOf<'tr'>;
  tbodyRowProps?: PropsOf<'tr'>;
  headerCellProps?: PropsOf<'th'>;
  cellProps?: PropsOf<'td'>;
  dayButtonProps?: PropsOf<'button'>;
  weekNumberProps?: PropsOf<'td'>;
  onDateChange$?: QRL<(date: LocalDate) => void>;
}

const regex = /^\d{4}-(0[1-9]|1[0-2])-\d{2}$/;

export const DatePickerRoot = component$<DatePickerRootProps>(
  ({
    date: dateProp,
    fullWeeks = false,
    locale = 'en',
    showWeekNumber = false,
    showDaysOfWeek = true,
    iconLeft,
    iconRight,
    containerProps = {},
    headerProps = {},
    actionButtonProps = {},
    actionLeftProps = {},
    actionRightProps = {},
    calendarProps = {},
    theadProps = {},
    tbodyProps = {},
    theadRowProps = {},
    tbodyRowProps = {},
    headerCellProps = {},
    cellProps = {},
    dayButtonProps = {},
    iconProps = {},
    titleProps = {},
    weekNumberProps = {},
    onDateChange$,
    unStyled,
    ...props
  }) => {

    // root constants
    const date = new Date().toISOString().split('T')[0] as LocalDate;
    const labelStr = containerProps['aria-label'] ?? ARIA_LABELS[locale].root;
    // days of the week
    const daysOfWeek = WEEKDAYS[locale];

    // signals
    const dateSignal = useSignal<LocalDate>(dateProp ?? date);
    const defaultDate = props['bind:date'] ?? dateSignal;
    const activeDate = useSignal<LocalDate | null>(null);
    const monthToRender = useSignal<Month>(defaultDate.value.split('-')[1] as Month);
    const yearToRender = useSignal<number>(+defaultDate.value.split('-')[0]);
    const dateToFocus = useSignal<LocalDate>(defaultDate.value);

    console.log(dateToFocus.value)
    console.log(activeDate.value)

    const datesArray = useComputed$(() => {
      const dates = daysArrGenerator({
        month: monthToRender.value,
        year: yearToRender.value.toString(),
        fullWeeks,
      });
      return dates;
    });

    const context: DatepickerContext = {
      showWeekNumber,
      showDaysOfWeek,
      daysOfWeek,
      datesArray,
      locale,
      monthToRender,
      yearToRender,
      defaultDate,
      activeDate,
      dateToFocus,
    };

    useContextProvider(datepickerContextId, context);

    // computed
    const labelSignal = useComputed$(() => {
      if (!activeDate.value) return labelStr;
      const [year, month] = activeDate.value.split('-');

      return `${labelStr} ${MONTHS_LG[locale][+month - 1]} ${year}`;
    });

    if (!regex.test(defaultDate.value))
      throw new Error('Invalid date format in Calendar. Please use YYYY-MM-DD format.');

    // taks
    useVisibleTask$(({ track, cleanup }) => {
      track(() => datesArray.value);

      // if (dateToFocus.value === defaultDate.value) return;

      if (datesArray.value.flat().includes(dateToFocus.value)) {
        const btn = document.querySelector(`button[data-value="${dateToFocus.value}"]`) as HTMLButtonElement | null;
        btn?.focus();
        btn?.setAttribute('tabindex', '0');
      }

      cleanup(() => {
        const btn = document.querySelector(`button[data-value="${dateToFocus.value}"]`) as HTMLButtonElement | null;
        btn?.setAttribute('tabindex', '-1');
        btn?.blur();
      });
    });

    // header utils
    const hMonth = MONTHS_LG[locale][+monthToRender.value - 1];
    const hTitle = `${hMonth} ${yearToRender.value}`;


    // icons
    const IconLeft = iconLeft ?? ChevronLeft;
    const IconRight = iconRight ?? ChevronRight;

    // events handlers
    const decreaseDate = $(() => {
      if (monthToRender.value === '01') {
        monthToRender.value = '12';
        yearToRender.value -= 1;
        return;
      }

      monthToRender.value = String(+monthToRender.value - 1).padStart(2, '0') as Month;
    });
    const increaseDate = $(() => {
      if (monthToRender.value === '12') {
        monthToRender.value = '01';
        yearToRender.value += 1;
        return;
      }

      monthToRender.value = String(+monthToRender.value + 1).padStart(2, '0') as Month;
    });

    return (
      <div data-qwik-date data-theme='light' aria-label={labelSignal.value} {...containerProps}>
        <header {...headerProps}>
          <button
            type='button'
            onClick$={[
              decreaseDate,
              $(() => {
                dateToFocus.value = `${yearToRender.value}-${monthToRender.value}-01`;
              }),
              actionButtonProps.onClick$,
              actionLeftProps.onClick$,
            ]}
            aria-label={ARIA_LABELS[locale].previous}
          >
            <IconLeft {...iconProps} />
          </button>

          <div aria-live='polite' role='presentation' {...titleProps}>
            {hTitle}
          </div>

          <button
            type='button'
            onClick$={[
              increaseDate,
              $(() => {
                dateToFocus.value = `${yearToRender.value}-${monthToRender.value}-01`;
              }),
              actionButtonProps.onClick$,
              actionRightProps.onClick$,
            ]}
            aria-label={ARIA_LABELS[locale].next}
          >
            <IconRight {...iconProps} />
          </button>
        </header>

        <Slot/>
      </div>
    );
  },
);
