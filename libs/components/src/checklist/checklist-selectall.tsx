import { component$, useContext, $ } from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';

export const ChecklistSelectAll = component$(() => {
  const { allSelected, toggleAllSelected } = useContext(ChecklistContext);
  return (
    <li>
      <input
        type="checkbox"
        checked={allSelected.value}
        onClick$={() => toggleAllSelected()}
      />
      {'  '}
      Select All
    </li>
  );
});
