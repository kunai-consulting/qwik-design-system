import { createContextId, type Signal } from '@builder.io/qwik';

export interface ChecklistState {
  items: Signal<boolean[]>;
  toggleItem: (index: number) => void;
  allSelected: Signal<boolean>;
  toggleAllSelected: () => void;
}

export const ChecklistContext =
  createContextId<ChecklistState>('ChecklistContext');
