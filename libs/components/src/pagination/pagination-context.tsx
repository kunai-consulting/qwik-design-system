import { createContextId, QRL, type Signal } from '@builder.io/qwik';

export const paginationContextId = createContextId<PaginationContext>('qds-pagination-context');

export type PaginationContext = {
  // selectedPageSig: Signal<number>;
  // totalPages: number;
  // perPageSig: Signal<number>;
  // onPageChange$: QRL<(page: number) => void>;
  perPageSig: Signal<number>;
  selectedPageSig: Signal<number>;
  isDisabledSig: Signal<boolean | undefined>;
  totalPages: number;
  siblingCount: number;
  onPageChange$: QRL<(page: number) => void>;
  localId: string;
  showFirst: boolean | undefined;
  showLast: boolean | undefined;
  page: number | undefined;
  perPage: number | undefined;
}

