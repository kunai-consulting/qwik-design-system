import { type PropsOf, type QRL, Slot, component$ } from "@builder.io/qwik";
import {
  usePagination,
  processChildren,
  findComponent,
} from "@kunai-consulting/qwik-hooks";
import { PaginationPage } from "./pagination-page";

type PaginationRootProps = PropsOf<"div"> & {
  /** Handler for when the current page changes */
  onPageChange$?: QRL<(page: number) => void>;
};

export const PaginationRoot = ({ children, ...props }: PropsOf<"div">) => {
  let currPageIndex = 0;

  findComponent(PaginationPage, (pageProps) => {
    pageProps._index = currPageIndex;
    currPageIndex++;
  });

  processChildren(children);

  return <PaginationBase {...props}>{children}</PaginationBase>;
};

const PaginationBase = component$((props: PropsOf<"div">) => {
  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
