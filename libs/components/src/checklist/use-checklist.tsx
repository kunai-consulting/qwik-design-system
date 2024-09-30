import {
  useContextProvider,
  $,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';
import { CheckboxContext } from '../checkbox/checkbox-context';

export const useChecklist = (initialStates: boolean[]) => {
  const items = useSignal(initialStates);
  const allSelected = useSignal(initialStates.every(Boolean));
  const indeterminate = useSignal(false);
  useContextProvider(CheckboxContext, allSelected);

  const updateAllSelected = $(() => {
    const allChecked = items.value.every(Boolean);
    const anyChecked = items.value.some(Boolean);
    allSelected.value = allChecked;
    indeterminate.value = anyChecked && !allChecked;
  });

  const setItems = $((newItems: boolean[]) => {
    items.value = newItems;
    allSelected.value = newItems.every(Boolean);
  });

  // const toggleItem = $((index: number) => {
  //   const newItems = [...items.value];
  //   newItems[index] = !newItems[index];
  //   items.value = newItems;
  //   allSelected.value = newItems.every(Boolean);
  //   setItems(newItems);
  // });

  const toggleAllSelected = $(() => {
    console.log('toggleAllSelected items ', items.value);

    const newState = !allSelected.value || indeterminate.value;
    allSelected.value = newState;
    items.value = items.value.map(() => newState);
    // setItems(items.value);
    updateAllSelected();
  });

  const toggleItem = $((index: number) => {
    items.value[index] = !items.value[index];
    console.log('use-checklist toggleItem items ', items.value);

    // updateAllSelected();
  });

  useContextProvider(ChecklistContext, {
    items,
    allSelected,
    toggleAllSelected,
    indeterminate,
    initialStates,
  });
};
