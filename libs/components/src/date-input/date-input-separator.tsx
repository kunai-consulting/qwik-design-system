import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";

export type PublicDateInputSeparatorProps = PropsOf<"span"> & {
  /** The separator character to display. If not provided, a Slot will be used instead. */
  separator?: string;
};

/**
 * Separator component for the Date Input.
 * Used to visually separate segments of the date input.
 */
export const DateInputSeparatorBase = component$(
  ({ separator, ...props }: PublicDateInputSeparatorProps) => {
    return (
      <Render fallback="span" {...props} data-qds-date-input-separator>
        {separator || <Slot />}
      </Render>
    );
  }
);

export const DateInputSeparator = withAsChild(DateInputSeparatorBase);
