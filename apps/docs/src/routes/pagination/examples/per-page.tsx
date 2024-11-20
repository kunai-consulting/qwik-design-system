import {$, component$, useSignal} from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);

  return (
    <Pagination.Root
      class="flex gap-4"
      totalPages={totalPagesSig.value}
      perPage={4}
      onPageChange$={$((page: number) => {
        selectedPageSig.value = page;
      })}
    >
      <Pagination.Ellipsis>...</Pagination.Ellipsis>
      <Pagination.Previous>Previous</Pagination.Previous>

      {/* creates 10 pages */}
      {Array.from({length: totalPagesSig.value}, (_, index) => {
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
      <Pagination.Last>Last</Pagination.Last>
    </Pagination.Root>
  );
});
