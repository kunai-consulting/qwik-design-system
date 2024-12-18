import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { findComponent, processChildren } from "../../utils/inline-component";
import { ChecklistItem } from "./checklist-item";

type ChecklistRootProps = Omit<PropsOf<"div">, "onChange$"> & {
  _numItems?: number;
};

export const ChecklistRoot = ({ children, ...props }: ChecklistRootProps) => {
  let currItemIndex = 0;
  let numItems = 0;

  findComponent(ChecklistItem, (itemProps) => {
    itemProps._index = currItemIndex;
    currItemIndex++;
    numItems = currItemIndex;
  });

  processChildren(children);

  return (
    <ChecklistBase _numItems={numItems} {...props}>
      {children}
    </ChecklistBase>
  );
};

export const ChecklistBase = component$((props: ChecklistRootProps) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
