import { component$, useSignal } from "@qwik.dev/core";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(3);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <Pagination.Root
      class="pagination-root"
      totalPages={totalPagesSig.value}
      currentPage={selectedPageSig.value}
      pages={paginationItems}
    >
      <Pagination.Previous class="pagination-previous">← Previous</Pagination.Previous>

      {paginationItems.map((item) => (
        <Pagination.Page key={`page-${item}`} class="pagination-page">
          {item}
        </Pagination.Page>
      ))}

      <Pagination.Next class="pagination-next">Next →</Pagination.Next>
    </Pagination.Root>
  );
});
