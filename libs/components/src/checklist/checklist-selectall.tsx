import {
  component$,
  useContext,
  $,
  type PropsOf,
  Slot,
  useContextProvider,
  useSignal,
} from '@builder.io/qwik';
import { ChecklistContext, type ChecklistState } from './checklist-context';
import { CheckboxRoot } from '../checkbox/checkbox-root';

export const ChecklistSelectAll = component$((props: PropsOf<'div'>) => {
  const context = useContext(ChecklistContext);

  const isInitiallySelected = context.initialStates.every(Boolean);
  const allSelected = useSignal(isInitiallySelected);
  const items = useSignal(context.items.value);
  const toggleAll = $(() => {
    const newState = !allSelected.value;
    allSelected.value = newState;
    items.value = items.value.map(() => newState);
    context.toggleAllSelected();
  });

  return (
    <CheckboxRoot
      as="li"
      bind:checked={allSelected}
      onClick$={toggleAll}
      id="selectAll"
      data-qds-selectall
    >
      <Slot />
    </CheckboxRoot>
  );
});
