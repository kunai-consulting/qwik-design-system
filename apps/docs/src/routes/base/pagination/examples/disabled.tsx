import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  // Examples for first page and last page
  const firstPageSig = useSignal(1);
  const lastPageSig = useSignal(5);
  const totalPagesSig = useSignal(5);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <div class="flex flex-col gap-4">
      {/* First page - Previous button disabled */}
      <h2>First Page (Previous disabled)</h2>
      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={firstPageSig.value}
        pages={paginationItems}
      >
        <Pagination.Previous class="pagination-previous disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
          Previous
        </Pagination.Previous>
        {paginationItems.map((item) => (
          <Pagination.Page
            class="pagination-page disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            key={`first-page-${item}`}
            isDisabled={item === firstPageSig.value}
          >
            {item}
          </Pagination.Page>
        ))}
        <Pagination.Next class="pagination-next disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
          Next
        </Pagination.Next>
      </Pagination.Root>

      {/* Last page - Next button disabled */}
      <h2>Last Page (Next disabled)</h2>
      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={lastPageSig.value}
        pages={paginationItems}
      >
        <Pagination.Previous class="pagination-previous disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
          Previous
        </Pagination.Previous>
        {paginationItems.map((item) => (
          <Pagination.Page
            class="pagination-page disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            key={`last-page-${item}`}
            isDisabled={item === lastPageSig.value}
          >
            {item}
          </Pagination.Page>
        ))}
        <Pagination.Next class="pagination-next disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none">
          Next
        </Pagination.Next>
      </Pagination.Root>
    </div>
  );
});
