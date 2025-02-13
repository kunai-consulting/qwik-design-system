import {
  $,
  type PropsOf,
  Slot,
  component$,
  useContext,
  useSignal,
  useTask$
} from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";
type PublicRadioGroupItemProps = PropsOf<"div"> & {
  value: string;
};
/** Individual radio option container component */
export const RadioGroupItem = component$<PublicRadioGroupItemProps>(
  ({ value, ...props }) => {
    const context = useContext(radioGroupContextId);
    const itemId = `${context.localId}-$trigger`;
    const itemRef = useSignal<HTMLDivElement | undefined>(undefined);
    return (
      // Identifier for individual radio group item container
      <div ref={itemRef} id={itemId} data-qds-radio-group-item {...props}>
        <Slot />
      </div>
    );
  }
);
