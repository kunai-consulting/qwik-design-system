import type { Locale } from './types';

export const MONTHS_LG = {
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
} as const;

export const MONTHS_SM = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
} as const;

export const ARIA_LABELS = {
  en: {
    previous: 'go to previous month',
    next: 'go to next month',
    root: 'Actual Date is:',
  },
  es: {
    previous: 'Ir al mes anterior',
    next: 'Ir al siguiente mes',
    root: 'La fecha actual es:',
  },
} as const;

export const WEEKDAYS = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
} as const satisfies Record<Locale, string[]>;

export const TRIGGER_LABELS = {
  en: 'Select a date',
} as const;
