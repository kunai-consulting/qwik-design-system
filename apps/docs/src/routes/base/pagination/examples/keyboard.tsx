import { component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik";

export default component$(() => {
  const selectedPageSig = useSignal(3);
  const totalPagesSig = useSignal(5);
  const paginationItems = [...Array(totalPagesSig.value)].map((_, index) => index + 1);

  return (
    <div class="flex flex-col gap-4">
      <p class="text-sm text-gray-600 space-y-2">
        <span class="block font-medium">Keyboard Navigation:</span>
        <span class="block">
          <kbd class="px-2 py-1 bg-gray-100 rounded">←</kbd> Previous page
          <span class="mx-2">|</span>
          <kbd class="px-2 py-1 bg-gray-100 rounded">→</kbd> Next page
        </span>
        <span class="block">
          <kbd class="px-2 py-1 bg-gray-100 rounded">Home</kbd> First page
          <span class="mx-2">|</span>
          <kbd class="px-2 py-1 bg-gray-100 rounded">End</kbd> Last page
        </span>
      </p>

      <Pagination.Root
        class="pagination-root"
        totalPages={totalPagesSig.value}
        currentPage={selectedPageSig.value}
        pages={paginationItems}
      >
        <Pagination.Previous
          class="pagination-previous disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          aria-label="Go to previous page"
        >
          Previous
        </Pagination.Previous>

        {paginationItems.map((item) => (
          <Pagination.Item
            class="pagination-item disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
            key={`page-${item}`}
            aria-label={`Page ${item}`}
          >
            {item}
          </Pagination.Item>
        ))}

        <Pagination.Next
          class="pagination-next disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none"
          aria-label="Go to next page"
        >
          Next
        </Pagination.Next>
      </Pagination.Root>
    </div>
  );
});
