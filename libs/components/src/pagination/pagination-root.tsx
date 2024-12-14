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
import { getPaginationItems } from "./utils";

export type PaginationRootProps = PropsOf<"div"> & {
  totalPages: number;
  currentPage?: number;
  "bind:page"?: Signal<number | 1>;
  onPageChange$?: QRL<(page: number) => void>;
  disabled?: boolean;
  pages: any[];
  ellipsis?: JSXChildren;
  maxLength?: number;
};

export const PaginationRoot =
  (props: PaginationRootProps) => {
    let currPageIndex = 0;

    findComponent(PaginationPage, (pageProps) => {
      pageProps._index = currPageIndex;
      currPageIndex++;
    });

    processChildren(props.children);

    return (
      <PaginationBase
        {...props}
      >
        {props.children}
      </PaginationBase>
    )
  };

export const PaginationBase = component$((props: PaginationRootProps) => {
  const {
    "bind:page": givenPageSig,
    totalPages,
    onPageChange$,
    currentPage,
    disabled,
    maxLength,
    pages,
    ellipsis,
    ...rest
  } = props;
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => disabled);
  const selectedPageSig = useBoundSignal(givenPageSig, currentPage || 1);
  const focusedIndexSig = useSignal<number | null>(null);
  const ellipsisSig = useComputed$(() => getPaginationItems(pages.length, selectedPageSig.value, maxLength || 7));
  const pagesSig = useSignal(pages)

  const context: PaginationContext = {
    isDisabledSig,
    totalPages,
    onPageChange$,
    currentPage,
    pagesSig,
    selectedPageSig,
    ellipsisSig,
    ellipsis,
    focusedIndexSig,
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


