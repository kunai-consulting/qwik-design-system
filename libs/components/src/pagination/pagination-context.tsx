import {createContextId, QRL, type Signal} from '@builder.io/qwik';

export interface PaginationState {
  selectedPage: Signal<number>;
  totalPages: number;
  onPageChange$: QRL<(page: number) => void>;
}

export const PaginationContext =
  createContextId<PaginationState>('PaginationContext');
