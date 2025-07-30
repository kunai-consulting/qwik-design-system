import { Pagination } from "@kunai-consulting/qwik";
import { component$, useSignal, useStyles$ } from "@qwik.dev/core";

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
          <Pagination.Item class="pagination-item" key={uniqueKey}>
            <span>{item}</span>
          </Pagination.Item>
        );
      })}
      <Pagination.Next class="pagination-next">Next</Pagination.Next>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
