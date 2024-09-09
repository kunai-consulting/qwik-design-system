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
  $,
} from '@builder.io/qwik';
import { CheckboxRoot } from '../checkbox/checkbox-root';
import { ChecklistContext, type ChecklistState } from './checklist-context';

interface ChecklistItemProps extends PropsOf<'div'> {
  _index?: number;
}

export const ChecklistItem = component$((props: ChecklistItemProps) => {
  const { _index, ...rest } = props;

  if (_index === undefined) {
    throw new Error('Checklist Item must have an index.');
  }

  const context = useContext(ChecklistContext);
  const isCheckedSig = useSignal(context.items.value[_index]);
  const initialLoadSig = useSignal(true);

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
    track(() => isCheckedSig.value);

    const isAllSelected = context.items.value.every((item) => item === true);

    if (isAllSelected) {
      context.allSelected.value = true;
    }

    if (initialLoadSig.value) {
      return;
    }

    context.items.value[_index] = isCheckedSig.value;

    if (isCheckedSig.value === false) {
      context.allSelected.value = false;
    }

    console.log('ALL SELECTED ', context.allSelected.value);
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
