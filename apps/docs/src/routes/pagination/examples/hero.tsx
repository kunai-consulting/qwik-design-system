import { component$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  return (
    <Pagination.Root>
      <Pagination.Previous>Previous</Pagination.Previous>
      <Pagination.Page>Page 1</Pagination.Page>
      <Pagination.Next>Next</Pagination.Next>
      <Pagination.Ellipsis>Ellipsis</Pagination.Ellipsis>
    </Pagination.Root>
  );
});
