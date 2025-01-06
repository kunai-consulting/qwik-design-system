import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  useStyles$(styles);
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);
  const pageSig = useSignal(5);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <Pagination.Root
      class="pagination-root"
      totalPages={totalPagesSig.value}
      bind:page={pageSig}
      onPageChange$={$((page: number) => {
        selectedPageSig.value = page;
      })}
      pages={paginationItems}
    >
      <Pagination.Ellipsis>...</Pagination.Ellipsis>
      <Pagination.Previous>Previous</Pagination.Previous>

      {/* creates 10 pages */}
      {Array.from({length: totalPagesSig.value}, (_, index) => {
        const uniqueKey = `page-${index}-${Date.now()}`;

        return (
          <Pagination.Page
            class="pagination-page"
            key={uniqueKey}
          >
            <span>{index + 1}</span>
          </Pagination.Page>
        );
      })}

      <Pagination.Next>Next</Pagination.Next>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
