import { createContextId, QRL, type Signal } from '@builder.io/qwik';

export interface PaginationState {
  selectedPageSig: Signal<number>;
  totalPages: number;
  perPageSig: Signal<number>;
  onPageChange$: QRL<(page: number) => void>;
}

export const paginationContext =
  createContextId<PaginationState>('PaginationContext');
