import { component$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  return (
    <Pagination.Root class="flex gap-4">
      <Pagination.Ellipsis>Ellipsis</Pagination.Ellipsis>
      <Pagination.Previous>Previous</Pagination.Previous>

      {/* creates 10 pages */}
      {Array.from({ length: 10 }, (_, index) => {
        const uniqueKey = `page-${index}-${Date.now()}`;

        return (
          <Pagination.Page
            class="border-slate-300 border size-8 flex justify-center items-center"
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
