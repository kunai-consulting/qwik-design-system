import {
  useContextProvider,
  $,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import { ChecklistContext } from './checklist-context';
import { CheckboxContext } from '../checkbox/checkbox-context';

export const useChecklist = (initialItems: boolean[]) => {
  const items = useSignal(initialItems);
  const allSelected = useSignal(initialItems.every(Boolean));
  useContextProvider(CheckboxContext, allSelected);
  console.log('use-checklist items ', items.value);
  console.log('use-checklist allSelected ', allSelected.value);

  const setItems = $((newItems: boolean[]) => {
    items.value = newItems;
    allSelected.value = newItems.every(Boolean);
  });

  const toggleItem = $((index: number) => {
    const newItems = [...items.value];
    newItems[index] = !newItems[index];
    items.value = newItems;
    allSelected.value = newItems.every(Boolean);
    setItems(newItems);
  });

  const toggleAllSelected = $(() => {
    const newState = !allSelected.value;
    allSelected.value = newState;
    items.value = items.value.map(() => newState);
    setItems(items.value);
  });

  useVisibleTask$(() => {
    toggleAllSelected();
  });

  useContextProvider(ChecklistContext, {
    items,
    toggleItem,
    allSelected,
    toggleAllSelected,
  });
};
