import { Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { DateInputSegmentBase, type SegmentProps } from "./date-input-segment";

export const DateInputYearBase = component$((props: SegmentProps) => {
  return (
    <DateInputSegmentBase type="year">
      <Slot />
    </DateInputSegmentBase>
  );
});

export const DateInputYear = withAsChild(DateInputYearBase);
