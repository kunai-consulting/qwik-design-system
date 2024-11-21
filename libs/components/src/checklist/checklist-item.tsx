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

  useTask$(function syncCheckboxState({ track }) {
    track(() => isCheckedSig.value);

    // itemsSig
    context.items.value[_index] = isCheckedSig.value;

    // root of both checkboxes updating.  context.allselected is updated causing the other useTask$ to run again
    // if (isCheckedSig.value === false) {
    //   context.allSelected.value = false;
    // }

    const isAllSelected = context.items.value.every((item) => item === true);
    const isAnyChecked = context.items.value.some(Boolean);

    if (isAllSelected) {
      context.allSelected.value = true;
    }
  });

  useTask$(({ track }) => {
    initialLoadSig.value = false;
  });

  return (
    <CheckboxRoot bind:checked={isCheckedSig}>
      <Slot />
    </CheckboxRoot>
  );
});
