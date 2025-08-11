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
type PublicPaginationPageProps = PropsOf<"button">;
/** Individual page number button component */
export const PaginationItem = component$((props: PublicPaginationPageProps) => {
  const context = useContext(paginationContextId);
  const itemRef = useSignal<HTMLElement>();

  const index = useConstant(() => {
    const itemIndex = context.currentIndex;
    context.currentIndex++;
    return itemIndex;
  });

  const isVisible = useComputed$(() => context.displayItems.value.includes(index + 1));

  if (!isVisible.value) {
    const isPrevVisible = context.displayItems.value.includes(index);
    return isPrevVisible ? <span>{context.ellipsis}</span> : null;
  }

  const isCurrentPage = useComputed$(() => index + 1 === context.selectedPage.value);

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

    switch (e.key) {
      case "ArrowRight": {
        if (currentFocusedIndex < context.legacyPages.value.length - 1) {
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
        context.focusedIndex.value = context.legacyPages.value.length - 1;
        break;
      }
    }
  });

  const handleFocus$ = $(() => {
    context.focusedIndex.value = index;
  });

  const handleClick$ = $(() => {
    context.selectedPage.value = index + 1;
  });

  return (
    <Render
      {...props}
      fallback="button"
      internalRef={itemRef}
      // Identifies a pagination page element
      data-qds-pagination-item
      // Specifies the index of the pagination page
      data-index={index}
      // Indicates if this is the currently selected page
      data-current={isCurrentPage.value}
      aria-current={isCurrentPage.value ? "page" : undefined}
      aria-label={`Page ${index + 1}`}
      role="button"
      tabIndex={0}
      onClick$={[handleClick$, props.onClick$]}
      onFocus$={[handleFocus$, props.onFocus$]}
      onKeyDown$={[handleKeyDownSync$, handleKeyDown$, props.onKeyDown$]}
    >
      <Slot />
    </Render>
  );
});
