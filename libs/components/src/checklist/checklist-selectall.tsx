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
  const { allSelected, toggleAllSelected } = useContext(ChecklistContext);

  return (
    <CheckboxRoot
      as="li"
      bind:checked={allSelected}
      aria-labelledby="test123"
      onClick$={() => toggleAllSelected()}
      role="group"
    >
      <Slot />
    </CheckboxRoot>
  );
});
