import { component$ } from "@builder.io/qwik";
import { DateInputDay } from "../date-input/date-input-day";
import type { PublicDateInputSegmentProps } from "../date-input/types";

export const CalendarDay = component$((props: PublicDateInputSegmentProps) => {
  return <DateInputDay {...props} />;
});
