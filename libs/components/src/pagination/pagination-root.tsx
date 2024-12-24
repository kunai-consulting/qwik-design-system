import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useTask$,
  type Signal,
  useComputed$,
  type JSXChildren,
} from "@builder.io/qwik";
import {
  processChildren,
  findComponent,
} from "../../utils/inline-component.ts";
import { PaginationPage } from "./pagination-page.tsx";
import { type PaginationContext, paginationContextId } from "./pagination-context.ts";
import { useBoundSignal } from "../../utils/bound-signal.tsx";
import { getPaginationItems } from "./utils.ts";

export type PaginationRootProps = PropsOf<"div"> & {
  totalPages: number;
  currentPage?: number;
  "bind:page"?: Signal<number | 1>;
  onPageChange$?: QRL<(page: number) => void>;
  disabled?: boolean;
  pages: number[];
  ellipsis?: JSXChildren;
  siblingCount?: number;
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
    siblingCount,
    pages,
    ellipsis,
    ...rest
  } = props;
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => disabled);
  const selectedPageSig = useBoundSignal(givenPageSig, currentPage || 1);
  const focusedIndexSig = useSignal<number | null>(null);
  const ellipsisSig = useComputed$(() => getPaginationItems(totalPages,selectedPageSig.value,siblingCount || 1));
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



  return (
    <div
      {...rest}
      data-qds-pagination-root
      data-disabled={context.isDisabledSig.value ? "" : undefined}
      aria-disabled={context.isDisabledSig.value ? "true" : "false"}
    >
      <Slot />
    </div>
  );
});


