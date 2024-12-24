import {component$, Slot, useComputed$, useContext, useTask$, useSignal, $} from "@builder.io/qwik";
import type {QwikIntrinsicElements} from "@builder.io/qwik";
import {paginationContextId} from "./pagination-context.ts";

type AllowedElements = "button" | "a" | "div" | "span";

type PaginationPageProps = {
  _index?: number;
  isDisabled?: boolean;
}

export const PaginationPage = component$(
  <C extends AllowedElements = "button">(
    props: QwikIntrinsicElements[C] & { as?: C } & PaginationPageProps
  ) => {
    const {as, _index, isDisabled, ...rest} = props;
    const Comp = as ?? "button";
    const context = useContext(paginationContextId);
    const pageRef = useSignal<HTMLElement>();

    if (_index === undefined) {
      throw new Error('Qwik Design System: PaginationPage must have an index');
    }

    const isVisible = useComputed$(() => 
      context.ellipsisSig.value.includes(_index + 1)
    );

    if (!isVisible.value) {
      const isPrevVisible = context.ellipsisSig.value.includes(_index);
      return isPrevVisible ? <span>{context.ellipsis}</span> : null;
    }

    const isCurrentPage = useComputed$(() => 
      (_index + 1) === context.selectedPageSig.value
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
        case 'ArrowRight':
          e.preventDefault();
          if (currentFocusedIndex < context.pagesSig.value.length - 1) {
            context.focusedIndexSig.value = currentFocusedIndex + 1;
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentFocusedIndex > 0) {
            context.focusedIndexSig.value = currentFocusedIndex - 1;
          }
          break;
        case 'Home':
          e.preventDefault();
          context.focusedIndexSig.value = 0;
          break;
        case 'End':
          e.preventDefault();
          context.focusedIndexSig.value = context.pagesSig.value.length - 1;
          break;
      }
    });

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
          ref={pageRef}
          data-qds-pagination-page
          data-index={_index}
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