import { Pagination } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";

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
        <Pagination.Item key={`page-${item}`} class="pagination-item">
          {item}
        </Pagination.Item>
      ))}

      <Pagination.Next class="pagination-next">Next →</Pagination.Next>
    </Pagination.Root>
  );
});
