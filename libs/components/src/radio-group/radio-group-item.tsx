import {
  type PropsOf,
  Slot,
  component$,
  useContext,
  useContextProvider
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicItemProps = PropsOf<"div"> & {
  value: string;
};

export const RadioGroupItemBase = component$((props: PublicItemProps) => {
  const context = useContext(radioGroupContextId);
  const { value, ...restProps } = props;
  const itemId = `${context.localId}-item-${value}`;

  useContextProvider(radioGroupContextId, {
    ...context,
    itemValue: value
  });

  return (
    <Render
      fallback="div"
      {...restProps}
      id={itemId}
      data-qds-radio-group-item
      data-orientation={context.orientation}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupItem = withAsChild(RadioGroupItemBase);
