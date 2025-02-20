import { type PropsOf, Slot, component$, useContext, useStyles$ } from "@qwik.dev/core";
import { radioGroupContextId } from "./radio-group-context";
import "./radio-group.css";
import styles from "./radio-group.css?inline";
export interface PublicRadioGroupIndicatorProps extends PropsOf<"span"> {
  /** The value associated with this radio indicator */
  value: string;
}
/** Visual indicator component that shows the selected state of a radio option */
export const RadioGroupIndicator = component$<PublicRadioGroupIndicatorProps>((props) => {
  useStyles$(styles);
  const context = useContext(radioGroupContextId);
  return (
    <span
      {...props}
      // Indicates whether the indicator is hidden based on selection state
      data-hidden={context.selectedValueSig.value !== props.value}
      // Indicates whether this indicator is in a checked state
      data-checked={context.selectedValueSig.value === props.value}
      // Identifier for the radio group indicator element
      data-qds-indicator
      aria-hidden={context.selectedValueSig.value !== props.value}
    >
      <Slot />
    </span>
  );
});
