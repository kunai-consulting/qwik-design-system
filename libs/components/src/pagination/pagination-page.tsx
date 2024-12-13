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

    if (isNaN(pageValue.value)) {
      return <span>{context.ellipsis}</span>;
    }

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
          data-qds-pagination-page
          data-current={isCurrentPage.value}
          aria-current={isCurrentPage.value ? "page" : ""}
          {...rest}
          disabled={isCurrentPage.value}
          onClick$={() => {
            if (!isNaN(pageValue.value)) {
              context.selectedPageSig.value = pageValue.value;
            }
          }}
        >
          <Slot/>
        </Comp>
      </>
    );
  }
);