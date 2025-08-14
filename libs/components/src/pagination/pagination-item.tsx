import {
  $,
  type PropsOf,
  Slot,
  component$,
  sync$,
  useComputed$,
  useConstant,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import { Render } from "../render/render";
import { paginationContextId } from "./pagination-context";

export type PublicPaginationItemProps = PropsOf<"button"> & {
  /** The page number this item represents */
  page: number;
};

/** Individual page number button component */
export const PaginationItem = component$((props: PublicPaginationItemProps) => {
  const { page, ...buttonProps } = props;
  const context = useContext(paginationContextId);
  const itemRef = useSignal<HTMLElement>();

  const index = useConstant(() => {
    const itemIndex = context.currentIndex;
    context.currentIndex++;
    return itemIndex;
  });

  const isCurrentPage = useComputed$(() => page === context.selectedPage.value);

  useTask$(({ track }) => {
    const focusedIndex = track(context.focusedIndex);
    if (focusedIndex !== index) return;
    itemRef.value?.focus();
  });

  const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    const isCurrentKey = keys.includes(e.key);
    if (!isCurrentKey) return;
    e.preventDefault();
  });

  const handleKeyDown$ = $((e: KeyboardEvent) => {
    const currentFocusedIndex = context.focusedIndex.value;
    if (currentFocusedIndex === null) return;

    const itemCount = context.currentIndex;

    switch (e.key) {
      case "ArrowRight": {
        if (currentFocusedIndex < itemCount - 1) {
          context.focusedIndex.value = currentFocusedIndex + 1;
        }
        break;
      }
      case "ArrowLeft": {
        if (currentFocusedIndex > 0) {
          context.focusedIndex.value = currentFocusedIndex - 1;
        }
        break;
      }
      case "Home": {
        context.focusedIndex.value = 0;
        break;
      }
      case "End": {
        context.focusedIndex.value = itemCount - 1;
        break;
      }
    }
  });

  const handleFocus$ = $(() => {
    context.focusedIndex.value = index;
  });

  const handleClick$ = $(() => {
    context.selectedPage.value = page;
  });

  return (
    <Render
      {...buttonProps}
      fallback="button"
      internalRef={itemRef}
      // Identifies a pagination page element
      data-qds-pagination-item
      // Indicates if this is the currently selected page
      data-current={isCurrentPage.value}
      aria-current={isCurrentPage.value ? "page" : undefined}
      aria-label={`Page ${page}`}
      tabIndex={0}
      onClick$={[handleClick$, buttonProps.onClick$]}
      onFocus$={[handleFocus$, buttonProps.onFocus$]}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$, buttonProps.onKeyDown$]}
    >
      <Slot />
    </Render>
  );
});
