import {component$, Slot, useComputed$, useContext, useTask$} from "@builder.io/qwik";
import type {QwikIntrinsicElements} from "@builder.io/qwik";
import {paginationContext} from "./pagination-context";

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

    const context = useContext(paginationContext);

    if (_index === undefined) {
      throw new Error('Qwik Design System: PaginationPage must have an index');
    }

    const isCurrent = useComputed$(() => {
      return _index + 1 === context.selectedPageSig.value;
    })

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp
          data-qds-pagination-page
          data-current={isCurrent.value}
          aria-current={isCurrent.value ? "page" : ""}
          {...rest}
          disabled={isCurrent.value}
          onClick$={() => {
            context.selectedPageSig.value = _index + 1;
          }}
        >
          <Slot/>
        </Comp>
      </>
    );
  }
);
