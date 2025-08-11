import { type JSXChildren, type QRL, type Signal, createContextId } from "@qwik.dev/core";

export const paginationContextId = createContextId<PaginationContext>(
  "qds-pagination-context"
);

export type PaginationContext = {
  selectedPage: Signal<number>;
  isDisabled: Signal<boolean | undefined>;
  totalPages: number;
  onPageChange$: QRL<(page: number) => void> | undefined;
  currentPage: number | undefined;
  legacyPages: Signal<number[]>;
  displayItems: Signal<(number | "...")[]>;
  focusedIndex: Signal<number | null>;
  ellipsis?: JSXChildren;
  currentIndex: number;
};
