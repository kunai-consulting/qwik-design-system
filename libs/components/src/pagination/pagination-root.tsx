import {
  findComponent,
  processChildren,
  useBoundSignal
} from "@kunai-consulting/qwik-utils";
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
import { PaginationItem } from "./pagination-item";
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
export const PaginationRoot = (props: PublicPaginationRootProps) => {
  let currPageIndex = 0;

  findComponent(PaginationItem, (pageProps) => {
    pageProps._index = currPageIndex;
    currPageIndex++;
  });

  processChildren(props.children);

  return <PaginationBase {...props}>{props.children}</PaginationBase>;
};
/** Root pagination container component that provides context and handles page management */
export const PaginationBase = component$((props: PublicPaginationRootProps) => {
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
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => disabled);
  const selectedPageSig = useBoundSignal(givenPageSig, currentPage || 1);
  const focusedIndexSig = useSignal<number | null>(null);
  const ellipsisSig = useComputed$(() =>
    getPaginationItems(totalPages, selectedPageSig.value, siblingCount || 1)
  );
  const pagesSig = useSignal(pages);

  const context: PaginationContext = {
    isDisabledSig,
    totalPages,
    onPageChange$,
    currentPage,
    pagesSig,
    selectedPageSig,
    ellipsisSig,
    ellipsis,
    focusedIndexSig
  };

  useContextProvider(paginationContextId, context);

  useTask$(async function handleChange({ track }) {
    track(() => context.selectedPageSig.value);
    if (isInitialLoadSig.value) {
      return;
    }

    selectedPageSig.value = context.selectedPageSig.value;

    await onPageChange$?.(context.selectedPageSig.value);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  return (
    <div
      {...rest}
      // Identifies the root pagination container element
      data-qds-pagination-root
      // Indicates whether the pagination component is disabled
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
    >
      <Slot />
    </div>
  );
});
