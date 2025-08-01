import { component$ } from "@qwik.dev/core";
import { DateInputYear } from "../date-input/date-input-year";
import type { PublicDateInputSegmentProps } from "../date-input/types";

export const CalendarYear = component$((props: PublicDateInputSegmentProps) => {
  return <DateInputYear {...props} />;
});
