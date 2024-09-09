import {
  type JSXNode,
  type JSXChildren,
  type PropsOf,
  component$,
  useContext,
  useSignal,
  Slot,
  useContextProvider,
  $,
} from '@builder.io/qwik';
import { findComponent, processChildren } from '../../utils/inline-component';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { ChecklistContext, type ChecklistState } from './checklist-context';
import { ChecklistItem } from './checklist-item';
import { useChecklist } from './use-checklist';

export const ChecklistRoot =
  //removing component to make inline causes Internal Server
  (props: { initialStates: boolean[]; children: JSXChildren | JSXNode }) => {
    const initialStates = props.initialStates;
    const children = props.children;
    let currItemIndex = 0;
    const itemsMap = new Map();
    console.log('initialStates ', initialStates);
    console.log('children ', children ? 'true' : 'false');

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
    processChildren(props.children);

    return (
      <ul>
        <ChecklistBase>{children}</ChecklistBase>
      </ul>
    );
  };

interface ChecklistItemProps extends PropsOf<'div'> {
  _index?: number;
  // context: typeof ChecklistContext;
}
export const ChecklistBase = component$((props: ChecklistItemProps) => {
  const items = useSignal([false, false, false]);
  const allSelected = useSignal(false);
  const toggleAllSelected = $(() => {
    allSelected.value = !allSelected.value;
  });
  const indeterminate = useSignal(false);
  const context: ChecklistState = {
    items,
    allSelected,
    toggleAllSelected,
    indeterminate,
  };
  useContextProvider(ChecklistContext, context);
  return (
    <div>
      <Slot />
    </div>
  );
});
