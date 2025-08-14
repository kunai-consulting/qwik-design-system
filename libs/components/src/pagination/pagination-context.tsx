import { type QRL, type Signal, createContextId } from "@qwik.dev/core";

export const paginationContextId = createContextId<PaginationContext>(
  "qds-pagination-context"
);

export type PaginationContext = {
  selectedPage: Signal<number>;
  isDisabled: Signal<boolean | undefined>;
  onPageChange$: QRL<(page: number) => void> | undefined;
  focusedIndex: Signal<number | null>;
  currentIndex: number;
};
