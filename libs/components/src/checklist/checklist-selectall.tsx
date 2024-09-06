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

export const ChecklistSelectAll = component$((props: PropsOf<'div'>) => {
  const { items, allSelected } = useContext(ChecklistContext);
  useContextProvider(ChecklistContext, { items, allSelected });

  return (
    <CheckboxRoot as="li" bind:checked={allSelected}>
      <Slot />
    </CheckboxRoot>
  );
});
