import {
  component$,
  type JSXChildren,
  type PropsOf,
  Slot,
} from '@builder.io/qwik';
import { useChecklist } from './use-checklist';
import { findComponent, processChildren } from '../../utils/inline-component';
import { ChecklistItem } from './checklist-item';

export const ChecklistBase = component$((props: PropsOf<'ul'>) => {
  return (
    <ul>
      <Slot />
    </ul>
  );
});

export const ChecklistRoot = component$(
  (props: { initialStates: boolean[]; children: JSXChildren }) => {
    const { initialStates } = props;
    useChecklist(initialStates);
    let currItemIndex = 0;
    let initialIndex = null;
    const itemsMap = new Map();
    const initialValue = initialStates[0];
    const children = props.children;

    findComponent(ChecklistItem, (itemProps) => {
      itemProps._index = currItemIndex;

      itemsMap.set(currItemIndex, itemProps.disabled);

      if (initialValue && initialValue === itemProps.value) {
        initialIndex = currItemIndex;
      }

      currItemIndex++;
      console.log(
        'findComponent assigned index:',
        currItemIndex,
        'to item:',
        itemProps
      );
    });

    processChildren(children);

    return (
      <ChecklistBase>
        <Slot />
      </ChecklistBase>
    );
  }
);
