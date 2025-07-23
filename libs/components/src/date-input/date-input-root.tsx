import {
  type HTMLElementAttrs,
  type QRL,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { resetIndexes } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import type { ISODate } from "../calendar/types";
import { Render } from "../render/render";
import type { DateInputContext } from "./date-input-context";
import { dateInputContextId } from "./date-input-context";

type PublicDateInputRootProps = Omit<HTMLElementAttrs<"div">, "onChange$"> & {
  onChange$?: QRL<(dates: (ISODate | null)[]) => void>;
};

// no-bindings -- bindings handled by DateInputField
/** The root Date Input component that manages state and provides context */
export const DateInputRootBase = component$<PublicDateInputRootProps>(
  ({ onChange$, ...props }) => {
    // items to store in context
    const localId = useId();
    const segmentRefs = useSignal<Signal<HTMLInputElement | undefined>[]>([]); // used for focus management
    const datesSig = useSignal<(ISODate | null)[]>([]);

    const isInitialLoadSig = useSignal(true);

    const context: DateInputContext = {
      localId,
      segmentRefs,
      datesSig
    };

    useContextProvider(dateInputContextId, context);

    useTask$(async ({ track, cleanup }) => {
      const dates = track(() => datesSig.value);
      if (!isInitialLoadSig.value && onChange$) {
        await onChange$(dates);
      }
      cleanup(() => {
        isInitialLoadSig.value = false;
      });
    });

    return (
      <Render fallback="div" data-qds-date-input-root {...props}>
        <Slot />
      </Render>
    );
  }
);

export const DateInputRoot = withAsChild(DateInputRootBase, (props) => {
  resetIndexes("date-input-field");
  resetIndexes("date-input-segment");
  return props;
});
