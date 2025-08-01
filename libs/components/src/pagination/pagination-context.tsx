import { type JSXChildren, type QRL, type Signal, createContextId } from "@qwik.dev/core";

export const paginationContextId = createContextId<PaginationContext>(
  "qds-pagination-context"
);

export type PaginationContext = {
  selectedPageSig: Signal<number>;
  isDisabledSig: Signal<boolean | undefined>;
  totalPages: number;
  onPageChange$: QRL<(page: number) => void> | undefined;
  currentPage: number | undefined;
  pagesSig: Signal<number[]>;
  ellipsisSig: Signal<(number | "...")[]>;
  focusedIndexSig: Signal<number | null>;
  ellipsis?: JSXChildren;
  currItemIndex: number;
};
