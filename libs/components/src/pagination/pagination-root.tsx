import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import {
  usePagination,
  processChildren,
  findComponent,
} from "@kunai-consulting/qwik-hooks";
import { PaginationPage } from "./pagination-page";

export const PaginationRoot = ({ children }: PropsOf<"div">) => {
  let currPageIndex = 0;

  findComponent(PaginationPage, (pageProps) => {
    pageProps._index = currPageIndex;
    currPageIndex++;
  });

  processChildren(children);

  return <PaginationBase>{children}</PaginationBase>;
};

const PaginationBase = component$((props: PropsOf<"div">) => {
  usePagination();

  return (
    <div {...props}>
      <Slot />
    </div>
  );
});
