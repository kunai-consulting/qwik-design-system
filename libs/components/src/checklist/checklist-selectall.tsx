import { component$, useContext, $, type PropsOf } from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { CheckboxIndicator } from '../checkbox/checkbox-indicator';
import { ChecklistItem } from './checklist-item';

export const ChecklistSelectAll = component$((props: PropsOf<'div'>) => {
  const { allSelected, toggleAllSelected } = useContext(ChecklistContext);
  return (
    <li>
      <div
        {...props}
        tabIndex={0}
        role="checkbox"
        aria-checked={allSelected.value}
        onClick$={() => toggleAllSelected()}
      />
    </li>
  );
});
