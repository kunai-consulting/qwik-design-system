import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type JSXChildren,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useComputed$,
  useContextProvider,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { type PaginationContext, paginationContextId } from "./pagination-context";
import { getPaginationItems } from "./utils";
export type PublicPaginationRootProps = PropsOf<"div"> & {
  /** The total number of pages to display */
  totalPages: number;
  /** Reactive value that can be controlled via signal. Sets the current active page number */
  "bind:page"?: Signal<number | 1>;
  /** Event handler for page change events */
  onPageChange$?: QRL<(page: number) => void>;
  /** Array of page numbers to display */
  pages: number[];
  /** Custom element to display for ellipsis */
  ellipsis?: JSXChildren;
  /** Number of siblings to show on each side of current page */
  siblingCount?: number;
} & BindableProps<{
    currentPage: number;
    disabled: boolean;
  }>;

/** Root pagination container component that provides context and handles page management */
export const PaginationRoot = component$((props: PublicPaginationRootProps) => {
  const {
    totalPages,
    onPageChange$,
    currentPage,
    siblingCount,
    pages,
    ellipsis,
    ...rest
  } = props;
  const isInitialLoad = useSignal(true);

  const { currentPageSig: selectedPage, disabledSig: isDisabled } = useBindings(props, {
    currentPage: 1,
    disabled: false
  });

  const focusedIndex = useSignal<number | null>(null);
  const displayItems = useComputed$(() =>
    getPaginationItems(totalPages, selectedPage.value, siblingCount || 1)
  );

  const legacyPages = useSignal(pages);
  const currentIndex = 0;

  const context: PaginationContext = {
    isDisabled,
    totalPages,
    onPageChange$,
    currentPage,
    legacyPages,
    selectedPage,
    displayItems,
    ellipsis,
    focusedIndex,
    currentIndex
  };

  useContextProvider(paginationContextId, context);

  useTask$(async function handleChange({ track }) {
    if (isInitialLoad.value) return;

    track(context.selectedPage);

    await onPageChange$?.(context.selectedPage.value);
  });

  useTask$(() => {
    isInitialLoad.value = false;
  });

  return (
    <div
      {...rest}
      // Identifies the root pagination container element
      data-qds-pagination-root
      // Indicates whether the pagination component is disabled
      data-disabled={context.isDisabled.value ? "" : undefined}
      aria-disabled={context.isDisabled.value ? "true" : "false"}
    >
      <Slot />
    </div>
  );
});
