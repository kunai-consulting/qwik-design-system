import {
  component$,
  useContext,
  type PropsOf,
  Slot,
  useTask$,
  useStyles$
} from "@builder.io/qwik";
import { CheckboxContext, checkboxContextId } from "./checkbox-context";
import "./checkbox.css";
import styles from "./checkbox.css?inline";

export type CheckboxIndicatorProps = PropsOf<"span">;

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(checkboxContextId);

  return (
    <span
      {...props}
      data-hidden={!context.isCheckedSig.value}
      data-checked={context.isCheckedSig.value ? "" : undefined}
      data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
      data-qds-indicator
      aria-hidden="true"
    >
      <Slot />
    </span>
  );
});
