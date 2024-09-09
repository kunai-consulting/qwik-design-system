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
  const allSelected = useSignal(false);
  const context = useContext(ChecklistContext);

  return (
    <CheckboxRoot as="li" bind:checked={allSelected} id="selectAll">
      <Slot />
    </CheckboxRoot>
  );
});
