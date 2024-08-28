import { useContextProvider, $, useSignal } from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';

export const useChecklist = (initialItems: boolean[]) => {
  const items = useSignal(initialItems);
  const allSelected = useSignal(initialItems.every(Boolean));

  const setItems = $((newItems: boolean[]) => {
    items.value = newItems;
    allSelected.value = newItems.every(Boolean);
  });

  const toggleItem = $((index: number) => {
    const newItems = [...items.value];
    newItems[index] = !newItems[index];
    setItems(newItems);
  });

  const toggleAllSelected = $(() => {
    const newState = !allSelected.value;
    allSelected.value = newState;
    items.value = items.value.map(() => newState);
  });

  useContextProvider(ChecklistContext, {
    items,
    toggleItem,
    allSelected,
    toggleAllSelected,
  });
};
