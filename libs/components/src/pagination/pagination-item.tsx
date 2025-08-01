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
    const itemIndex = context.currItemIndex;
    context.currItemIndex++;
    return itemIndex;
  });

  const isVisible = useComputed$(() => context.ellipsisSig.value.includes(index + 1));

  if (!isVisible.value) {
    const isPrevVisible = context.ellipsisSig.value.includes(index);
    return isPrevVisible ? <span>{context.ellipsis}</span> : null;
  }

  const isCurrentPage = useComputed$(() => index + 1 === context.selectedPageSig.value);

  useTask$(({ track }) => {
    const focusedIndex = track(() => context.focusedIndexSig.value);
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
    const currentFocusedIndex = context.focusedIndexSig.value;
    if (currentFocusedIndex === null) return;

    switch (e.key) {
      case "ArrowRight": {
        if (currentFocusedIndex < context.pagesSig.value.length - 1) {
          context.focusedIndexSig.value = currentFocusedIndex + 1;
        }
        break;
      }
      case "ArrowLeft": {
        if (currentFocusedIndex > 0) {
          context.focusedIndexSig.value = currentFocusedIndex - 1;
        }
        break;
      }
      case "Home": {
        context.focusedIndexSig.value = 0;
        break;
      }
      case "End": {
        context.focusedIndexSig.value = context.pagesSig.value.length - 1;
        break;
      }
    }
  });

  const handleFocus$ = $(() => {
    context.focusedIndexSig.value = index;
  });

  const handleClick$ = $(() => {
    context.selectedPageSig.value = index + 1;
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
