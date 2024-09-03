import {
  component$,
  type Signal,
  Slot,
  useContext,
  useSignal,
  useTask$,
} from '@builder.io/qwik';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { ChecklistContext } from './checklist-context';

export const ChecklistItem = component$(() => {
  const { items } = useContext(ChecklistContext);

  const isCheckedSig = useSignal(false);

  return (
    <CheckboxRoot as="li" bind:checked={isCheckedSig}>
      <Slot />
    </CheckboxRoot>
  );
});
