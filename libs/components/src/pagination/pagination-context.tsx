import {createContextId, QRL, type Signal} from '@builder.io/qwik';

export interface PaginationState {
  selectedPage: Signal<number>;
  totalPages: number;
  perPage: number;
  onPageChange$: QRL<(page: number) => void>;
}

export const paginationContext =
  createContextId<PaginationState>('PaginationContext');
