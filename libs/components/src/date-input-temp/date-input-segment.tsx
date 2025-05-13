import {
  component$,
  useContext,
  useSignal,
  useTask$,
  type PropsOf
} from "@builder.io/qwik";
import { getNextIndex } from "@kunai-consulting/qwik-utils";
import { dateInputContextId } from "./date-input-root";

export type SegmentProps = {
  _index?: number;
  type: "day" | "month" | "year";
} & PropsOf<"div">;

export const DateInputSegmentBase = component$((props: SegmentProps) => {
  const segmentRef = useSignal<HTMLInputElement>();
  const context = useContext(dateInputContextId);
  const index = props._index ?? -1;

  useTask$(function registerSegmentRef() {
    context.segmentRefs.value[index] = segmentRef;
  });

  return (
    <input
      maxLength={2}
      style={{ border: "1px solid red" }}
      onInput$={(e) => {
        const length = (e.target as HTMLInputElement).value.length;
        const nextSegment = context.segmentRefs.value[index + 1]?.value;

        if (length >= 2) {
          if (!nextSegment) {
            console.log("at end of array");
            return;
          }

          nextSegment.focus();
        }
      }}
      ref={segmentRef}
      data-index={props._index}
    />
  );
});

export function DateInputSegment(props: SegmentProps) {
  const index = getNextIndex("date-input-temp");

  props._index = index;

  return <DateInputSegmentBase {...props} />;
}
