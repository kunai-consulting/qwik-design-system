import { component$, Slot } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { DateInputSegmentBase, type SegmentProps } from "./date-input-segment";

export const DateInputMonthBase = component$((props: SegmentProps) => {
  console.log(props._index);

  return (
    <DateInputSegmentBase type="month">
      <Slot />
    </DateInputSegmentBase>
  );
});

export const DateInputMonth = withAsChild(DateInputMonthBase);
