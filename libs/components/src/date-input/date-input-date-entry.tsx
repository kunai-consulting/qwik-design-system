import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useContextProvider,
  useId,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import type { QRL } from "@builder.io/qwik";
import type { BindableProps } from "@kunai-consulting/qwik-utils";
import { useBindings } from "@kunai-consulting/qwik-utils";
import { withAsChild } from "../as-child/as-child";
import type { ISODate } from "../calendar/types";
import { Render } from "../render/render";
import { dateInputContextId } from "./date-input-context";
import {
  type DateInputDateEntryContext,
  dateInputDateEntryContextId
} from "./date-input-date-entry-context";
import { getInitialSegments } from "./utils";

export type PublicDateInputDateEntryProps = Omit<PropsOf<"div">, "onChange$"> & {
  /** Event handler called when a date is selected */
  onChange$?: QRL<(date: ISODate | null) => void>;
} & BindableProps<DateInputDateEntryBoundProps>;

export type DateInputDateEntryBoundProps = {
  /** The currently selected date */
  date: ISODate | null;
  /** When enabled prevents the user from interacting with the date input */
  disabled: boolean;
};

// Regular expression for validating ISO date format (yyyy-mm-dd)
const isoDateRegex = /^\d{1,4}-(0[1-9]|1[0-2])-\d{2}$/;

/** Container for the segments of the Date Input that assists with accessibility
 * by giving a target for the label and providing a role for screen readers.
 */
export const DateInputDateEntryBase = component$(
  (props: PublicDateInputDateEntryProps) => {
    const { onChange$, ...rest } = props;
    const rootContext = useContext(dateInputContextId);
    const isInitialLoadSig = useSignal(true);
    const { dateSig, disabledSig } = useBindings<DateInputDateEntryBoundProps>(props, {
      date: props.date ?? null,
      disabled: false
    });

    const entryId = useId();
    const { dayOfMonthSegment, monthSegment, yearSegment } = getInitialSegments(
      dateSig.value
    );
    const dayOfMonthSegmentSig = useSignal(dayOfMonthSegment);
    const monthSegmentSig = useSignal(monthSegment);
    const yearSegmentSig = useSignal(yearSegment);

    // This flag helps maintain two behaviors when the date changes to null.
    // 1. When the date signal changes to null programmatically, we want to clear all segments.
    // 2. When the date is cleared via keyboard input on an individual segment, we leave the other segments unchanged.
    // See usage in updateSegmentsWithNewDateValue
    const isInternalSegmentClearance = useSignal<boolean>(false);

    const context: DateInputDateEntryContext = {
      dateSig,
      entryId,
      disabledSig,
      dayOfMonthSegmentSig,
      monthSegmentSig,
      yearSegmentSig,
      isInternalSegmentClearance
    };

    useContextProvider(dateInputDateEntryContextId, context);

    if (props.date && !isoDateRegex.test(props.date)) {
      throw new Error("Invalid date format. Please use yyyy-mm-dd format.");
    }

    const elementId = `${context.entryId}-entry`;

    /**
     * Updates the segments with the new date value.
     *
     * @param date - The new date value or null
     *
     * This method is used to react to updates to the date signal, particularly those originating from outside the component,
     * to make sure the segments match the date value.
     */
    const updateSegmentsWithNewDateValue = $((date: ISODate | null) => {
      if (date !== null) {
        const [year, month, day] = date.split("-");
        if (yearSegmentSig.value.numericValue !== +year) {
          yearSegmentSig.value = {
            ...yearSegmentSig.value,
            numericValue: +year,
            isoValue: year,
            isPlaceholder: false
          };
        }
        if (monthSegmentSig.value.numericValue !== +month) {
          monthSegmentSig.value = {
            ...monthSegmentSig.value,
            numericValue: +month,
            isoValue: month,
            isPlaceholder: false
          };
        }
        if (dayOfMonthSegmentSig.value.numericValue !== +day) {
          dayOfMonthSegmentSig.value = {
            ...dayOfMonthSegmentSig.value,
            numericValue: +day,
            isoValue: day,
            isPlaceholder: false
          };
        }
      } else if (!context.isInternalSegmentClearance.value) {
        if (!yearSegmentSig.value.isPlaceholder) {
          yearSegmentSig.value = {
            ...yearSegmentSig.value,
            numericValue: undefined,
            isoValue: undefined,
            isPlaceholder: true
          };
        }
        if (!monthSegmentSig.value.isPlaceholder) {
          monthSegmentSig.value = {
            ...monthSegmentSig.value,
            numericValue: undefined,
            isoValue: undefined,
            isPlaceholder: true
          };
        }
        if (!dayOfMonthSegmentSig.value.isPlaceholder) {
          dayOfMonthSegmentSig.value = {
            ...dayOfMonthSegmentSig.value,
            numericValue: undefined,
            isoValue: undefined,
            isPlaceholder: true
          };
        }
      }
      context.isInternalSegmentClearance.value = false;
    });

    useTask$(async ({ track, cleanup }) => {
      const date = track(() => dateSig.value);
      await updateSegmentsWithNewDateValue(date);
      if (!isInitialLoadSig.value && onChange$) {
        await onChange$(date);
      }
      cleanup(() => {
        isInitialLoadSig.value = false;
      });
    });

    return (
      <Render
        fallback={"div"}
        {...rest}
        data-qds-date-input-date-entry
        role="group"
        id={elementId}
        aria-labelledby={`${rootContext.localId}-label`}
      >
        <Slot />
      </Render>
    );
  }
);

export const DateInputDateEntry = withAsChild(DateInputDateEntryBase);
