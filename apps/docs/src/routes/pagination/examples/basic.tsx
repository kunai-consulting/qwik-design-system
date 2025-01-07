import { component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(5);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <Pagination.Root
      class="pagination-root"
      totalPages={totalPagesSig.value}
      currentPage={selectedPageSig.value}
      pages={paginationItems}
      siblingCount={1}
    >
      <Pagination.Previous class="pagination-previous">Prev</Pagination.Previous>
      {paginationItems.map((item, index) => (
        <Pagination.Page class="pagination-page" key={`page-${index}`}>
          {item}
        </Pagination.Page>
      ))}
      <Pagination.Next class="pagination-next">Next</Pagination.Next>
    </Pagination.Root>
  );
});
