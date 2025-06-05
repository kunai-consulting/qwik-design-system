import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);
  return (
    <Pagination.Root
      class="pagination-root"
      currentPage={1}
      totalPages={totalPagesSig.value}
      pages={paginationItems}
      onPageChange$={$((page: number) => {
        selectedPageSig.value = page;
      })}
    >
      <Pagination.Previous isFirst>First</Pagination.Previous>
      <Pagination.Previous>Previous</Pagination.Previous>

      {/* creates 10 pages */}
      {Array.from({ length: totalPagesSig.value }, (_, index) => {
        const uniqueKey = `page-${index}-${Date.now()}`;

        return (
          <Pagination.Item class="pagination-item" key={uniqueKey}>
            <span>{index + 1}</span>
          </Pagination.Item>
        );
      })}

      <Pagination.Next>Next</Pagination.Next>
      <Pagination.Next isLast>Last</Pagination.Next>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
