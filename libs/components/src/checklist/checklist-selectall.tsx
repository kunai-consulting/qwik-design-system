import {
  component$,
  useContext,
  $,
  type PropsOf,
  Slot,
  useContextProvider,
} from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { CheckboxIndicator } from '../checkbox/checkbox-indicator';
import { ChecklistItem } from './checklist-item';

export const ChecklistSelectAll = component$((props: PropsOf<'div'>) => {
  const { allSelected } = useContext(ChecklistContext);
  // console.log('ChecklistSelectAll items ', items.value);
  // console.log('ChecklistSelectAll allSelected ', allSelected.value);
  // console.log('ChecklistSelectAll indeterminate ', indeterminate.value);

  return (
    <CheckboxRoot as="li" bind:checked={allSelected}>
      <Slot />
    </CheckboxRoot>
  );
});
