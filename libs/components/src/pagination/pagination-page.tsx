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

    const pageValue = context.pagesSig.value[_index];
    const isCurrentPage = !isNaN(pageValue) && pageValue === context.selectedPageSig.value;

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
          data-qds-pagination-page
          data-current={isCurrentPage}
          aria-current={isCurrentPage ? "page" : ""}
          {...rest}
          disabled={isCurrentPage}
          onClick$={() => {
            if (!isNaN(pageValue)) {
              context.selectedPageSig.value = pageValue;
            }
          }}
        >
          <Slot/>
        </Comp>
      </>
    );
  }
);