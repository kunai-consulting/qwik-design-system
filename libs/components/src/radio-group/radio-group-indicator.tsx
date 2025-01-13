import { type PropsOf, Slot, component$, useContext, useStyles$ } from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";
import "./radio-group.css";
import styles from "./radio-group.css?inline";

export type RadioGroupIndicatorProps = PropsOf<"span">;

export const RadioGroupIndicator = component$<RadioGroupIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(radioGroupContextId);

  return (
    <span
      {...props}
      data-hidden={!context.isCheckedSig.value}
      data-checked={context.isCheckedSig.value ? "" : undefined}
      data-qds-indicator
      aria-hidden="true"
    >
      <Slot />
    </span>
  );
});
