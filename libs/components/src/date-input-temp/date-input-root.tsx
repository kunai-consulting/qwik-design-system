import {
  type Signal,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useSignal
} from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export const dateInputContextId = createContextId<DateInputContext>(
  "date-input-temp-context"
);

type DateInputContext = {
  segmentRefs: Signal<SegmentRef[]>;
};

type SegmentRef = Signal<HTMLInputElement | undefined>;

export const DateInputRootBase = component$(() => {
  const segmentRefs = useSignal<SegmentRef[]>([]);

  const context: DateInputContext = {
    segmentRefs
  };

  useContextProvider(dateInputContextId, context);

  return (
    <Render fallback="div">
      <Slot />
    </Render>
  );
});

export const DateInputRoot = withAsChild(DateInputRootBase, (props) => {
  resetIndexes("date-input-temp");

  return props;
});
