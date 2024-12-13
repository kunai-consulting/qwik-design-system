import { $, component$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  useStyles$(styles);
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);
  const maxLengthSig = useSignal(7);

  const paginationItems = useSignal(Pagination.getPaginationItems(totalPagesSig.value, selectedPageSig.value, maxLengthSig.value));

  return (  
    <Pagination.Root
      class="pagination-root"
      totalPages={totalPagesSig.value}
      currentPage={selectedPageSig.value}
      onPageChange$={$((page: number) => {
        selectedPageSig.value = page;
        paginationItems.value = Pagination.getPaginationItems(totalPagesSig.value, selectedPageSig.value, maxLengthSig.value);
      })}
      pages={paginationItems.value}
      ellipsis="..."
    >
        {paginationItems.value.map((item, index) => {
        const uniqueKey = `page-${index}-${Date.now()}`;
        return (
          <Pagination.Page
            class="pagination-page"
            key={uniqueKey}
            _index={index}
          >
            <span>{item}</span>
          </Pagination.Page>
        );
      })}
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
