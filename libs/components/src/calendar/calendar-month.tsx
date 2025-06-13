import { component$ } from "@builder.io/qwik";
import { DateInputMonth } from "../date-input/date-input-month";
import type { PublicDateInputSegmentProps } from "../date-input/types";

export const CalendarMonth = component$((props: PublicDateInputSegmentProps) => {
  return <DateInputMonth {...props} />;
});
