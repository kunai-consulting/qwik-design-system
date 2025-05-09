type DayFormats = "dd" | "d";
type MonthFormats = "mm" | "m" | "MMM" | "MMMM";
type YearFormats = "yyyy" | "yy";
export type Separator = "/" | "-" | ".";
export type DateFormat =
  | `${DayFormats}${Separator}${MonthFormats}${Separator}${YearFormats}`
  | `${YearFormats}${Separator}${MonthFormats}${Separator}${DayFormats}`
  | `${MonthFormats}${Separator}${DayFormats}${Separator}${YearFormats}`;

export type Locale = "en";
export type LocalDate = `${number}-${number}-${number}`;
export type Month =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

export type DayOfMonth =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "31";

// ISO 8601 date format. The number representation for year works as long as the year is >= 1000 and <= 9999.
// This range is adequate for most date entry use cases.
export type ISODate = `${number}-${Month}-${DayOfMonth}`;
