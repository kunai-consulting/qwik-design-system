import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  JSXNode,
  JSXChildren,
  useContextProvider,
  useSignal,
  useTask$,
  type Signal,
  useComputed$,
  useId,
  $
} from "@builder.io/qwik";
import {
  usePagination,
  processChildren,
  findComponent,
} from "@kunai-consulting/qwik-hooks";
import { PaginationPage } from "./pagination-page";
import { type PaginationContext, paginationContextId } from "./pagination-context";
import { useBoundSignal } from "../../utils/bound-signal";

export type PaginationRootProps = PropsOf<"div"> & {
  totalPages: number;
  currentPage?: number;
  "bind:page"?: Signal<number | 1>;
  /** Handler for when the current page changes */
  onPageChange$: QRL<(page: number) => void>;
  disabled?: boolean;
  pages: any[];
  ellipsis?: JSXChildren;
};

export const PaginationRoot = component$((props: PaginationRootProps) => {
  const {
    "bind:page": givenPageSig,
    totalPages,
    onPageChange$,
    currentPage,
    disabled,
    pages,
    ellipsis,
    ...rest
  } = props;
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const selectedPageSig = useBoundSignal(givenPageSig, props.currentPage || 1);
  const pagesSig = useSignal(props.pages);
  const focusedIndexSig = useSignal<number | null>(null);

  const context: PaginationContext = {
    isDisabledSig,
    totalPages,
    onPageChange$,
    currentPage,
    pagesSig,
    selectedPageSig,
    ellipsis,
    focusedIndexSig,
  };

  useContextProvider(paginationContextId, context);

  useTask$(({ track }) => {
    const pages = track(() => props.pages);
    pagesSig.value = pages;
  });

  useTask$(async function handleChange({ track }) {
    track(() => context.selectedPageSig.value);
    if (isInitialLoadSig.value) {
      return;
    }

    await onPageChange$?.(context.selectedPageSig.value);
  });

  useTask$(() => {
    isInitialLoadSig.value = false;
  });

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    const currentFocusedIndex = focusedIndexSig.value;
    if (currentFocusedIndex === null) return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (currentFocusedIndex < pagesSig.value.length - 1) {
          focusedIndexSig.value = currentFocusedIndex + 1;
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (currentFocusedIndex > 0) {
          focusedIndexSig.value = currentFocusedIndex - 1;
        }
        break;
      case 'Home':
        e.preventDefault();
        focusedIndexSig.value = 0;
        break;
      case 'End':
        e.preventDefault();
        focusedIndexSig.value = pagesSig.value.length - 1;
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        const pageValue = pagesSig.value[currentFocusedIndex];
        if (!isNaN(pageValue)) {
          selectedPageSig.value = pageValue;
        }
        break;
    }
  });

  return (
    <div
      {...rest}
      data-qds-pagination-root
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
      onKeyDown$={handleKeyDown$}
    >
      <Slot />
    </div>
  );
});


