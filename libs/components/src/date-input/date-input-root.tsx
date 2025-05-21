import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal
} from "@builder.io/qwik";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";

type PublicDateInputRootProps = PropsOf<"div">;

/** The root Date Input component that manages state and provides context */
export const DateInputRootBase = component$<PublicDateInputRootProps>((props) => {
  const localId = useId();

  // Focus management signals and methods
  const segmentRefs = useSignal<Signal<HTMLInputElement | undefined>[]>([]);

  const context: DateInputContext = {
    localId,
    segmentRefs
  };

  useContextProvider(dateInputContextId, context);

  return (
    <Render fallback="div" data-qds-date-input-root {...props}>
      <Slot />
    </Render>
  );
});

export const DateInputRoot = withAsChild(DateInputRootBase, (props) => {
  resetIndexes("date-input-segment");
  return props;
});
