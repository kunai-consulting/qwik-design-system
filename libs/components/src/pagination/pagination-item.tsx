import {
  $,
  Slot,
  component$,
  useComputed$,
  useContext,
  useSignal,
  useTask$
} from "@qwik.dev/core";
import type { QwikIntrinsicElements } from "@qwik.dev/core";
import { paginationContextId } from "./pagination-context";
type PublicAllowedElements = "button" | "a" | "div" | "span";
type PublicPaginationPageProps = {
  /** Internal index of the page item */
  _index?: number;
  /** Whether this page item is disabled */
  isDisabled?: boolean;
};
/** Individual page number button component */
export const PaginationItem = component$(
  <C extends PublicAllowedElements = "button">(
    props: QwikIntrinsicElements[C] & {
      as?: C;
    } & PublicPaginationPageProps
  ) => {
    const { as, _index, isDisabled, ...rest } = props;
    const Comp = as ?? "button";
    const context = useContext(paginationContextId);
    const pageRef = useSignal<HTMLElement>();

    if (_index === undefined) {
      throw new Error("Qwik Design System: PaginationPage must have an index");
    }

    const isVisible = useComputed$(() => context.ellipsisSig.value.includes(_index + 1));

    if (!isVisible.value) {
      const isPrevVisible = context.ellipsisSig.value.includes(_index);
      return isPrevVisible ? <span>{context.ellipsis}</span> : null;
    }

    const isCurrentPage = useComputed$(
      () => _index + 1 === context.selectedPageSig.value
    );

    useTask$(({ track }) => {
      const focusedIndex = track(() => context.focusedIndexSig.value);
      if (focusedIndex === _index) {
        pageRef.value?.focus();
      }
    });

    const handleKeyDown$ = $((e: KeyboardEvent) => {
      const currentFocusedIndex = context.focusedIndexSig.value;
      if (currentFocusedIndex === null) return;

      switch (e.key) {
        case "ArrowRight": {
          e.preventDefault();
          if (currentFocusedIndex < context.pagesSig.value.length - 1) {
            context.focusedIndexSig.value = currentFocusedIndex + 1;
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          if (currentFocusedIndex > 0) {
            context.focusedIndexSig.value = currentFocusedIndex - 1;
          }
          break;
        }
        case "Home": {
          e.preventDefault();
          context.focusedIndexSig.value = 0;
          break;
        }
        case "End": {
          e.preventDefault();
          context.focusedIndexSig.value = context.pagesSig.value.length - 1;
          break;
        }
      }
    });

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
          ref={pageRef}
          // Identifies a pagination page element
          data-qds-pagination-item
          // Specifies the index of the pagination page
          data-index={_index}
          // Indicates if this is the currently selected page
          data-current={isCurrentPage.value}
          aria-current={isCurrentPage.value ? "page" : undefined}
          aria-label={`Page ${_index + 1}`}
          role="button"
          tabIndex={0}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          {...rest}
          onClick$={(e: Event) => {
            e.preventDefault();
            context.selectedPageSig.value = _index + 1;
          }}
          onFocus$={() => {
            context.focusedIndexSig.value = _index;
          }}
          onKeyDown$={handleKeyDown$}
        >
          <Slot />
        </Comp>
      </>
    );
  }
);
