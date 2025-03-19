import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useStyles$,
  useTask$
} from "@builder.io/qwik";
import { CheckboxContext, checkboxContextId } from "./checkbox-context";
import "./checkbox.css";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import styles from "./checkbox.css?inline";
export type PublicCheckboxIndicatorProps = PropsOf<"span">;

// composition check

// another change

/** Visual indicator component showing the checkbox state */
export const CheckboxIndicator = component$<PublicCheckboxIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(checkboxContextId);
  return (
    <span
      {...props}
      // Indicates whether the indicator should be hidden based on checkbox state
      data-hidden={!context.isCheckedSig.value}
      // Indicates whether the checkbox is in a checked state
      data-checked={context.isCheckedSig.value ? "" : undefined}
      // Indicates whether the checkbox is in an indeterminate state
      data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
      // Identifier for the checkbox indicator element
      data-qds-indicator
      aria-hidden="true"
    >
      <Slot />
    </span>
  );
});
