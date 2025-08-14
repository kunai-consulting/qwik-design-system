import { type BindableProps, useBindings } from "@kunai-consulting/qwik-utils";
import {
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  component$,
  useContextProvider,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { type PaginationContext, paginationContextId } from "./pagination-context";
export type PublicPaginationRootProps = PropsOf<"div"> & {
  /** Reactive value that can be controlled via signal. Sets the current active page number */
  "bind:page"?: Signal<number | 1>;
  /** Event handler for page change events */
  onPageChange$?: QRL<(page: number) => void>;
} & BindableProps<{
    currentPage: number;
    disabled: boolean;
  }>;

/** Root pagination container component that provides context and handles page management */
export const PaginationRoot = component$((props: PublicPaginationRootProps) => {
  const { onPageChange$, ...rest } = props;
  const isInitialLoad = useSignal(true);

  const { currentPageSig: selectedPage, disabledSig: isDisabled } = useBindings(props, {
    currentPage: 1,
    disabled: false
  });

  const focusedIndex = useSignal<number | null>(null);

  const context: PaginationContext = {
    isDisabled,
    onPageChange$,
    selectedPage,
    focusedIndex,
    currentIndex: 0
  };

  useContextProvider(paginationContextId, context);

  useTask$(async function handleChange({ track }) {
    if (isInitialLoad.value) return;

    track(selectedPage);

    await onPageChange$?.(selectedPage.value);
  });

  useTask$(() => {
    isInitialLoad.value = false;
  });

  return (
    <Render
      {...rest}
      fallback="div"
      role="navigation"
      aria-label={props["aria-label"] ?? "Pagination"}
      // Identifies the root pagination container element
      data-qds-pagination-root
      // Indicates whether the pagination component is disabled
      data-disabled={isDisabled.value ? "" : undefined}
      aria-disabled={isDisabled.value ? "true" : "false"}
    >
      <Slot />
    </Render>
  );
});
