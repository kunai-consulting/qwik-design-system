import {
  type PropsOf,
  type Signal,
  Slot,
  component$,
  createContextId,
  useComputed$,
  useContext,
  useContextProvider
} from "@qwik.dev/core";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { radioGroupContextId } from "./radio-group-context";

type PublicItemProps = PropsOf<"div"> & {
  value: string;
};

export const radioGroupItemContextId = createContextId<RadioGroupItemContext>(
  "radio-group-item-context"
);

type RadioGroupItemContext = {
  isSelectedSig: Signal<boolean>;
  itemValue: string;
};

export const RadioGroupItemBase = component$((props: PublicItemProps) => {
  const context = useContext(radioGroupContextId);
  const itemId = `${context.localId}-item-${props.value}`;

  const isSelectedSig = useComputed$(
    () => context.selectedValueSig.value === props.value
  );

  const itemContext: RadioGroupItemContext = {
    isSelectedSig,
    itemValue: props.value
  };

  useContextProvider(radioGroupItemContextId, itemContext);

  return (
    <Render
      {...props}
      fallback="div"
      id={itemId}
      data-qds-radio-group-item
      data-orientation={context.orientation}
    >
      <Slot />
    </Render>
  );
});

export const RadioGroupItem = withAsChild(RadioGroupItemBase);
