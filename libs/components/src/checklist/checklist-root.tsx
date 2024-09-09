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
    const children = props.children;
    let currItemIndex = 0;
    const itemsMap = new Map();

    findComponent(ChecklistItem, (itemProps) => {
      itemProps._index = currItemIndex;
      itemsMap.set(currItemIndex, itemProps.disabled);
      currItemIndex++;
    });

    processChildren(props.children);

    return (
      <ul>
        <ChecklistBase initialStates={props.initialStates}>
          {children}
        </ChecklistBase>
      </ul>
    );
  };

type ChecklistRootProps = PropsOf<'div'> & {
  initialStates: boolean[];
};

export const ChecklistBase = component$(
  ({ initialStates, ...props }: ChecklistRootProps) => {
    const items = useSignal<boolean[]>(initialStates);
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
      initialStates,
    };

    useContextProvider(ChecklistContext, context);
    return (
      <div>
        <Slot />
      </div>
    );
  }
);
