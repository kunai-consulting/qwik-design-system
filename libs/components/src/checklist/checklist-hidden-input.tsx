import { component$ } from "@builder.io/qwik";
import { CheckboxHiddenInput } from "../checkbox/checkbox-hidden-input";

type PublicCheckboxHiddenInputProps = {
  name: string;
  value?: string;
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
