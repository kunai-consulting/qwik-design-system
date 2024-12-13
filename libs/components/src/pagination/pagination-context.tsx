import { createContextId, JSXChildren, QRL, type Signal } from '@builder.io/qwik';

export const paginationContextId = createContextId<PaginationContext>('qds-pagination-context');

export type PaginationContext = {
  selectedPageSig: Signal<number>;
  isDisabledSig: Signal<boolean | undefined>;
  totalPages: number;
  onPageChange$: QRL<(page: number) => void>;
  currentPage: number | undefined;
  pagesSig: Signal<any[]>;
  focusedIndexSig: Signal<number | null>;
  ellipsis?: JSXChildren;
}


