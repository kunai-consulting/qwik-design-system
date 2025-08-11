import { useBoundSignal } from "@kunai-consulting/qwik-utils";
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
  /** The initial page number to display when component loads */
  currentPage?: number;
  /** Reactive value that can be controlled via signal. Sets the current active page number */
  "bind:page"?: Signal<number | 1>;
  /** Event handler for page change events */
  onPageChange$?: QRL<(page: number) => void>;
  /** Whether the pagination component is disabled */
  disabled?: boolean;
  /** Array of page numbers to display */
  pages: number[];
  /** Custom element to display for ellipsis */
  ellipsis?: JSXChildren;
  /** Number of siblings to show on each side of current page */
  siblingCount?: number;
};

/** Root pagination container component that provides context and handles page management */
export const PaginationRoot = component$((props: PublicPaginationRootProps) => {
  const {
    "bind:page": givenPageSig,
    totalPages,
    onPageChange$,
    currentPage,
    disabled,
    siblingCount,
    pages,
    ellipsis,
    ...rest
  } = props;
  const isInitialLoad = useSignal(true);
  const isDisabled = useComputed$(() => disabled);
  const selectedPage = useBoundSignal(givenPageSig, currentPage || 1);
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
    track(context.selectedPage);
    if (isInitialLoad.value) {
      return;
    }

    selectedPage.value = context.selectedPage.value;

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
