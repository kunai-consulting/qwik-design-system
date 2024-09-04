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
  const initialLoadSig = useSignal(false);
  const context = useContext(ChecklistContext);

  useTask$(({ track }) => {
    track(() => context.allSelected.value);

    if (initialLoadSig.value) {
      return;
    }

    if (context.allSelected.value) {
      isCheckedSig.value = true;
    } else {
      isCheckedSig.value = false;
    }
  });

  useTask$(({ track }) => {
    initialLoadSig.value = false;
  });

  return (
    <CheckboxRoot as="li" bind:checked={isCheckedSig} aria-labelledby="test123">
      <Slot />
    </CheckboxRoot>
  );
});

// 1) GET TESTS WORKING FOR CHECKBOX

// 2) GET FAILING TEST FOR SELECT ALL ON CHECKLIST. WHAT IS THE IDEAL BEHAVIOR?
