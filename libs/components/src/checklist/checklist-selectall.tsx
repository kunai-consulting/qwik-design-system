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
  const allSelected = useSignal(context.allSelected.value);
  const items = useSignal(context.items.value);
  console.log('ChecklistSelectAll items ', items.value);

  console.log('ChecklistSelectAll context ', context);
  console.log('ChecklistSelectAll allSelected ', allSelected.value);
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
    >
      <Slot />
    </CheckboxRoot>
  );
});
