import { Pagination } from "@kunai-consulting/qwik";
import { component$, useSignal } from "@qwik.dev/core";

export default component$(() => {
  const selectedPageSig = useSignal(5); // Start in middle to show siblings
  const totalPagesSig = useSignal(10);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <div class="flex flex-col gap-4">
      {/* Small sibling count */}
      <h2>1 Sibling Count</h2>
      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={selectedPageSig.value}
        pages={paginationItems}
        siblingCount={1}
        ellipsis="..."
      >
        <Pagination.Previous class="pagination-previous">Previous</Pagination.Previous>
        {paginationItems.map((item) => (
          <Pagination.Item class="pagination-item" key={`sibling-1-page-${item}`}>
            {item}
          </Pagination.Item>
        ))}
        <Pagination.Next class="pagination-next">Next</Pagination.Next>
      </Pagination.Root>

      {/* Large sibling count */}
      <h2>2 Sibling Count</h2>
      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={selectedPageSig.value}
        pages={paginationItems}
        siblingCount={2}
        ellipsis="..."
      >
        <Pagination.Previous class="pagination-previous">Previous</Pagination.Previous>
        {paginationItems.map((item) => (
          <Pagination.Item class="pagination-item" key={`sibling-2-page-${item}`}>
            {item}
          </Pagination.Item>
        ))}
        <Pagination.Next class="pagination-next">Next</Pagination.Next>
      </Pagination.Root>
    </div>
  );
});
