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
  useId
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
  showFirst?: boolean;
  showLast?: boolean;
  totalPages: number;
  page?: number;
  "bind:page"?: Signal<number | 1>;
  perPage?: number;
  /** Handler for when the current page changes */
  onPageChange$: QRL<(page: number) => void>;
  disabled?: boolean;
};

export const PaginationRoot = component$((props: PaginationRootProps) => {
  const {
    "bind:page": givenPageSig,
    showFirst,
    showLast,
    totalPages,
    onPageChange$,
    page,
    disabled,
    perPage,
    ...rest
  } = props;
  const isInitialLoadSig = useSignal(true);
  const isDisabledSig = useComputed$(() => props.disabled);
  const selectedPageSig = useBoundSignal(givenPageSig, props.page || 1);
  const perPageSig = useSignal(props.perPage || 1);
  const localId = useId();

  const context: PaginationContext = {
    isDisabledSig,
    localId,
    showFirst,
    showLast,
    totalPages,
    onPageChange$,
    page,
    perPage,
    selectedPageSig,
    perPageSig,
    siblingCount: 0
  };

  useContextProvider(paginationContextId, context);

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


