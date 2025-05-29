import { type PropsOf, component$, useContext } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { dateInputDateEntryContextId } from "./date-input-date-entry-context";
type PublicDateInputHiddenNativeInputProps = PropsOf<"input">;

/** A hidden native text input for form submission */
export const DateInputHiddenInput = component$(
  (props: PublicDateInputHiddenNativeInputProps) => {
    const context = useContext(dateInputDateEntryContextId);

    return (
      <VisuallyHidden>
        <input
          type="text"
          tabIndex={-1}
          data-qds-date-input-hidden-input
          name={context.name ?? props.name ?? undefined}
          required={context.required ?? props.required ?? undefined}
          value={context.dateSig.value ?? props.value ?? undefined}
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
