import type { Month } from "./types";

export const daysArrGenerator = ({
  month,
  year,
  fullWeeks = false
}: {
  month: Month;
  year: string;
  fullWeeks?: boolean;
}) => {
  // Year values less than 1000 are considered invalid and would throw a runtime error
  // This reassigns the year value to the current year if it's less than 1000, preventing the runtime error,
  // but possibly showing unexpected dates in the calendar for such values.
  // Alternatively, we could change the handling in the DateInput component to prevent bubbling-up dates with less than 4 digits
  if (year.length !== 4) {
    year = new Date().getFullYear().toString();
  }
  const date = new Date(+year, +month - 1, 1);
  const firstDayOfWeek = date.getDay();
  const daysInMonth = new Date(+year, +month, 0).getDate();

  const weeks = [];
  let currentWeek = [];

  // Helper function to format date as 'yyyy-mm-dd'
  const formatDate = (y: number, m: number, d: number) => {
    const mm = m < 10 ? `0${m}` : m;
    const dd = d < 10 ? `0${d}` : d;
    return `${y}-${mm}-${dd}`;
  };

  // Fill the previous month's days if fullWeeks is true
  if (fullWeeks) {
    // Previous month's details
    const prevMonth = +month === 1 ? 12 : +month - 1;
    const prevYear = +month === 1 ? +year - 1 : +year;
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate();

    // Fill the previous month's days
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      currentWeek.push(formatDate(prevYear, prevMonth, daysInPrevMonth - i));
    }
  } else {
    // Fill the previous days with nulls
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
  }

  // Fill the current month's days
  for (let day = 1; day <= daysInMonth; day++) {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(formatDate(+year, +month, day));
  }

  // Fill the next month's days if fullWeeks is true
  if (fullWeeks) {
    let nextMonthDay = 1;
    const nextMonth = +month === 12 ? 1 : +month + 1;
    const nextYear = +month === 12 ? +year + 1 : +year;

    while (currentWeek.length < 7) {
      currentWeek.push(formatDate(nextYear, nextMonth, nextMonthDay++));
    }
    weeks.push(currentWeek);

    while (weeks.length < 6) {
      currentWeek = [];
      for (let i = 0; i < 7; i++) {
        currentWeek.push(formatDate(nextYear, nextMonth, nextMonthDay++));
      }
      weeks.push(currentWeek);
    }
  } else {
    // Fill the rest of the last week with nulls
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

export const getWeekNumber = (dateString: string) => {
  const date = new Date(dateString);
  const target = new Date(date.valueOf());
  const dayNumber = (date.getDay() + 6) % 7; // Make Monday=0, Tuesday=1, ..., Sunday=6
  target.setDate(target.getDate() - dayNumber + 3); // Set to nearest Thursday
  const firstThursday = new Date(target.getFullYear(), 0, 4); // The first Thursday of the year
  const weekNumber =
    1 +
    Math.round(
      ((target.getTime() - firstThursday.getTime()) / 86400000 -
        3 +
        ((firstThursday.getDay() + 6) % 7)) /
        7
    );
  return weekNumber;
};
