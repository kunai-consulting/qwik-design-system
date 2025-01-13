import { component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

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
          <Pagination.Page class="pagination-page" key={`sibling-1-page-${item}`}>
            {item}
          </Pagination.Page>
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
          <Pagination.Page class="pagination-page" key={`sibling-2-page-${item}`}>
            {item}
          </Pagination.Page>
        ))}
        <Pagination.Next class="pagination-next">Next</Pagination.Next>
      </Pagination.Root>
    </div>
  );
});
