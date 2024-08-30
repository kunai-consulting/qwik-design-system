import { component$, Slot, useContext, useSignal } from '@builder.io/qwik';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { ChecklistContext } from './checklist-context';

export const ChecklistItem = component$(() => {
  const { items } = useContext(ChecklistContext);

  // make inline component
  // const itemSignal = useSignal(items.value[_index]);
  // console.log('checklistitemindicator ', items.value[_index]);

  // If you do pass bind:checked, from the Checklist, you can now control the checkbox

  return (
    <CheckboxRoot>
      <Slot />
    </CheckboxRoot>
  );
});
