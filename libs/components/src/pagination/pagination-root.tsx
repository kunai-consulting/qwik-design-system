import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  JSXNode,
  JSXChildren,
  useContextProvider,
  useSignal, useTask$
} from "@builder.io/qwik";
import {
  usePagination,
  processChildren,
  findComponent,
} from "@kunai-consulting/qwik-hooks";
import {PaginationPage} from "./pagination-page";
import {paginationContext, PaginationState} from "./pagination-context";

type PaginationRootProps = PropsOf<"div"> & {
  totalPages: number;
  /** Handler for when the current page changes */
  onPageChange$: QRL<(page: number) => void>;
};

export const PaginationRoot =
  (props: {
    children: JSXChildren | JSXNode;
    totalPages: number;
    onPageChange$: QRL<(page: number) => void>;
    class?: string;
  }) => {
    let currPageIndex = 0;

    findComponent(PaginationPage, (pageProps) => {
      pageProps._index = currPageIndex;
      currPageIndex++;
    });

    processChildren(props.children);

    return (
      <PaginationBase
        {...props}
        totalPages={props.totalPages}
        onPageChange$={props.onPageChange$}
      >
        {props.children}
      </PaginationBase>
    )
  };

const PaginationBase = component$(
  ({totalPages, onPageChange$, ...props}: PaginationRootProps) => {
    const selectedPage = useSignal(1);

    const context: PaginationState = {
      selectedPage,
      totalPages,
      onPageChange$
    }
    useContextProvider(paginationContext, context);

    // useTask$(({track}) => {
    //   track(() => context.selectedPage.value);
    // })

    return (
      <div data-qds-pagination-root {...props} class={props.class}>
        <Slot/>
      </div>
    );
  });
