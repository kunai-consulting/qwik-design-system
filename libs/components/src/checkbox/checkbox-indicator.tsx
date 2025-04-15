import {
  type PropsOf,
  Slot,
  component$,
  useComputed$,
  useContext,
  useStyles$
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
import "./checkbox.css";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import styles from "./checkbox.css?inline";
export type PublicCheckboxIndicatorProps = PropsOf<"span">;
/** Visual indicator component showing the checkbox state */
export const CheckboxIndicatorBase = component$<PublicCheckboxIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(checkboxContextId);

  const isHiddenSig = useComputed$(() => context.checkedSig.value === false);
  const isCheckedSig = useComputed$(() => context.checkedSig.value === true);

  return (
    <Render
      {...props}
      fallback="span"
      // Indicates whether the indicator should be hidden based on checkbox state
      data-hidden={isHiddenSig.value}
      // Indicates whether the checkbox is in a checked state
      data-checked={isCheckedSig.value}
      // Indicates whether the checkbox is in an indeterminate state
      data-mixed={context.checkedSig.value === "mixed"}
      // Identifier for the checkbox indicator element
      data-qds-checkbox-indicator
      aria-hidden="true"
    >
      <Slot />
    </Render>
  );
});

export const CheckboxIndicator = withAsChild(CheckboxIndicatorBase);
