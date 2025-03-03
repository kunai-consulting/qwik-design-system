import { $, component$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <Pagination.Root
      class="pagination-root"
      totalPages={totalPagesSig.value}
      currentPage={selectedPageSig.value}
      pages={paginationItems}
      siblingCount={totalPagesSig.value}
      ellipsis="..."
    >
      <Pagination.Previous class="pagination-previous">Prev</Pagination.Previous>
      {paginationItems.map((item, index) => {
        const uniqueKey = `page-${index}-${Date.now()}`;
        return (
          <Pagination.Page class="pagination-page" key={uniqueKey}>
            <span>{item}</span>
          </Pagination.Page>
        );
      })}
      <Pagination.Next class="pagination-next">Next</Pagination.Next>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
