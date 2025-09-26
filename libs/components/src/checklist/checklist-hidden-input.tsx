import { component$ } from "@builder.io/qwik";
import { CheckboxHiddenInput } from "../checkbox/checkbox-hidden-input";

type PublicCheckboxHiddenInputProps = {
  /** The name attribute for the hidden input element used in form submission */
  name: string;
  /** The value attribute for the hidden input element when checked */
  value?: string;
  /** Whether the checklist input is required for form validation */
  required?: boolean;
};

/**
 *  The checklist hidden input for facilitating native form handling. Delegates to the Checkbox hidden input under the hood.
 */
export const ChecklistHiddenInput = component$(
  (props: PublicCheckboxHiddenInputProps) => {
    return <CheckboxHiddenInput {...props} />;
  }
);
