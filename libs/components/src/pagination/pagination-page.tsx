import {component$, Slot, useComputed$, useContext, useTask$} from "@builder.io/qwik";
import type {QwikIntrinsicElements} from "@builder.io/qwik";
import {paginationContextId} from "./pagination-context";

type AllowedElements = "button" | "a" | "div" | "span";

type PaginationPageProps = {
  _index?: number;
}

export const PaginationPage = component$(
  <C extends AllowedElements = "button">(
    props: QwikIntrinsicElements[C] & { as?: C } & PaginationPageProps
  ) => {
    const {as, _index, ...rest} = props;
    const Comp = as ?? "button";
    const context = useContext(paginationContextId);

    if (_index === undefined) {
      throw new Error('Qwik Design System: PaginationPage must have an index');
    }

    const pageValue = useComputed$(() => context.pagesSig.value[_index]);
    const isCurrentPage = useComputed$(() => 
      !isNaN(pageValue.value) && pageValue.value === context.selectedPageSig.value
    );

    useTask$(({ track }) => {
      const focusedIndex = track(() => context.focusedIndexSig.value);
      if (focusedIndex === _index) {
        // Focus the button element
        (document.querySelector(`[data-qds-pagination-page][data-index="${_index}"]`) as HTMLElement)?.focus();
      }
    });

    if (isNaN(pageValue.value)) {
      return <span>{context.ellipsis}</span>;
    }

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
         data-qds-pagination-page
         data-index={_index}
         data-current={isCurrentPage.value}
         aria-current={isCurrentPage.value ? "page" : undefined}
         aria-label={`Page ${pageValue.value}`}
         role="button"
         tabIndex={0}
         {...rest}
         disabled={isCurrentPage.value}
         onClick$={(e: Event) => {
           // Prevent default to avoid losing focus
           e.preventDefault();
           if (!isNaN(pageValue.value)) {
             context.selectedPageSig.value = pageValue.value;
           }
         }}
         onFocus$={() => {
           context.focusedIndexSig.value = _index;
         }}
        >
          <Slot/>
        </Comp>
      </>
    );
  }
);