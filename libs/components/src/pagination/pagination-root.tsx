import {
  type PropsOf,
  type QRL,
  Slot,
  component$,
  JSXNode,
  JSXChildren,
  useContextProvider,
  useSignal,
  useTask$,
  type Signal
} from "@builder.io/qwik";
import {
  usePagination,
  processChildren,
  findComponent,
} from "@kunai-consulting/qwik-hooks";
import { PaginationPage } from "./pagination-page";
import { paginationContext, PaginationState } from "./pagination-context";
import { useBoundSignal } from "../../utils/bound-signal";

type PaginationRootProps = PropsOf<"div"> & {
  totalPages: number;
  page?: number;
  "bind:page"?: Signal<number | 1>;
  perPage?: number;
  /** Handler for when the current page changes */
  onPageChange$: QRL<(page: number) => void>;
};

export const PaginationRoot =
  (props: {
    children: JSXChildren | JSXNode;
    totalPages: number;
    onPageChange$: QRL<(page: number) => void>;
    page?: number;
    "bind:page"?: Signal<number | 1>;
    perPage?: number;
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
  ({"bind:page": givenValueSig, totalPages, onPageChange$, ...props}: PaginationRootProps) => {

    const selectedPageSig = useBoundSignal(givenValueSig, props.page || 1);
    const perPageSig = useSignal(props.perPage || 1);

    const context: PaginationState = {
      selectedPageSig,
      totalPages,
      perPageSig,
      onPageChange$
    }
    useContextProvider(paginationContext, context);

    useTask$(({track}) => {
      track(() => context.selectedPageSig.value);
      onPageChange$(context.selectedPageSig.value);
    })

    return (
      <div data-qds-pagination-root {...props} class={props.class}>
        <Slot/>
      </div>
    );
  });
