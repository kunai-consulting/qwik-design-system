import { component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedPageSig = useSignal(5); // Middle page to show ellipsis on both sides
  const totalPagesSig = useSignal(10);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <div class="flex flex-col gap-4">
      {/* Default dots ellipsis */}
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
          <Pagination.Item class="pagination-item" key={`dots-page-${item}`}>
            {item}
          </Pagination.Item>
        ))}
        <Pagination.Next class="pagination-next">Next</Pagination.Next>
      </Pagination.Root>

      {/* Custom ellipsis */}
      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={selectedPageSig.value}
        pages={paginationItems}
        siblingCount={1}
        ellipsis="•••"
      >
        <Pagination.Previous class="pagination-previous">Previous</Pagination.Previous>
        {paginationItems.map((item) => (
          <Pagination.Item class="pagination-item" key={`custom-page-${item}`}>
            {item}
          </Pagination.Item>
        ))}
        <Pagination.Next class="pagination-next">Next</Pagination.Next>
      </Pagination.Root>
    </div>
  );
});
