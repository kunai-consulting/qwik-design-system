import { asChild, type AsChildProps } from "../../utils/merge-props";
import { CheckboxRoot } from "./checkbox-root";
import { CheckboxIndicator } from "./checkbox-indicator";
import { CheckboxTrigger } from "./checkbox-trigger";
import { CheckboxLabel } from "./checkbox-label";
import { CheckboxDescription } from "./checkbox-description";
import { CheckboxHiddenInput } from "./checkbox-hidden-input";
import { CheckboxErrorMessage } from "./checkbox-error-message";

export const Root = asChild(CheckboxRoot);
export const Indicator = asChild(CheckboxIndicator);
export const Trigger = asChild(CheckboxTrigger);
export const Label = asChild(CheckboxLabel);
export const Description = asChild(CheckboxDescription);
export const HiddenInput = asChild(CheckboxHiddenInput);
export const ErrorMessage = asChild(CheckboxErrorMessage);
