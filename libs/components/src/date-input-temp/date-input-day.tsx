import { component$, Slot } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { DateInputSegmentBase, type SegmentProps } from "./date-input-segment";

export const DateInputDayBase = component$((props: SegmentProps) => {
  return (
    <DateInputSegmentBase type="day">
      <Slot />
    </DateInputSegmentBase>
  );
});

export const DateInputDay = withAsChild(DateInputDayBase);
