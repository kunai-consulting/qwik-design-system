import {
  component$,
  type PropsOf,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
  useVisibleTask$,
} from '@builder.io/qwik';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { ChecklistContext } from './checklist-context';

interface ChecklistItemProps extends PropsOf<'div'> {
  _index?: number;
  // context: typeof ChecklistContext;
}

export const ChecklistItem = component$((props: ChecklistItemProps) => {
  const isCheckedSig = useSignal(false);
  const initialLoadSig = useSignal(false);
  const context = useContext(ChecklistContext);
  const { _index = 0, ...rest } = props;
  console.log('ChecklistItem items ', context.items.value);

  if (_index === undefined) {
    throw new Error('Checklist Item must have an index.');
  }
  useTask$(() => {
    console.log('context.items.value ', context.items.value);
  });
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
    <CheckboxRoot as="li" bind:checked={isCheckedSig} index={_index}>
      <Slot />
    </CheckboxRoot>
  );
});

// 2) GET FAILING TEST FOR SELECT ALL ON CHECKLIST. WHAT IS THE IDEAL BEHAVIOR?
