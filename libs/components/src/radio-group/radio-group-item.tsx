import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { radioGroupContextId } from "./radio-group-context";

type PublicItemProps = PropsOf<"div"> & {
  value: string;
};

export const RadioGroupItem = component$((props: PublicItemProps) => {
  const context = useContext(radioGroupContextId);
  const { value, ...restProps } = props;
  const itemId = `${context.localId}-item-${value}`;

  return (
    <div
      {...restProps}
      id={itemId}
      data-qds-radio-group-item
      data-orientation={context.orientation}
    >
      <Slot />
    </div>
  );
});
