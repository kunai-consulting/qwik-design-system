import {
  type JSXChildren,
  type PropsOf,
  component$,
  Slot,
} from '@builder.io/qwik';
import { findComponent, processChildren } from '../../utils/inline-component';

import { ChecklistItem } from './checklist-item';

export const ChecklistRoot = (
  props: { initialStates: boolean[]; children: JSXChildren } & PropsOf<'ul'>
) => {
  const { initialStates } = props;
  let currItemIndex = 0;
  const itemsMap = new Map();
  const children = props.children;
  findComponent(ChecklistItem, (itemProps) => {
    itemProps._index = currItemIndex;
    itemsMap.set(currItemIndex, itemProps.disabled);
    currItemIndex++;
    console.log(
      'findComponent assigned index:',
      currItemIndex,
      'to item:',
      itemProps._index
    );
  });
  processChildren(children);
  return <ChecklistBase>{children}</ChecklistBase>;
};
interface ChecklistItemProps extends PropsOf<'div'> {
  _index?: number;
}
export const ChecklistBase = component$((props: ChecklistItemProps) => {
  return (
    <ChecklistItem>
      <Slot />
    </ChecklistItem>
  );
});
