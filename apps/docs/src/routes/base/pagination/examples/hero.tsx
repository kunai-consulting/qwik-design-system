import { Pagination, createPaginationPositions } from "@kunai-consulting/qwik";
import { component$, useComputed$, useSignal, useStyles$ } from "@qwik.dev/core";

export default component$(() => {
  useStyles$(styles);
  const currentPage = useSignal(1);
  const totalPages = useSignal(10);

  const positions = useComputed$(() =>
    createPaginationPositions(currentPage.value, totalPages.value, 2)
  );

  return (
    <Pagination.Root class="pagination-root" currentPage={currentPage.value}>
      <Pagination.PrevTrigger class="pagination-previous">
        Previous
      </Pagination.PrevTrigger>

      {/* YOU control what renders and when */}
      {positions.value.map((position, index) => {
        if (position.separator) {
          return <Pagination.Separator key={index}>...</Pagination.Separator>;
        }

        return (
          <Pagination.Item class="pagination-item" key={index} page={position.page!}>
            {position.page}
          </Pagination.Item>
        );
      })}

      <Pagination.NextTrigger class="pagination-next">Next</Pagination.NextTrigger>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
