import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Pagination } from "@kunai-consulting/qwik-components";

export default component$(() => {
  useStyles$(styles);
  const selectedPageSig = useSignal(1);
  const totalPagesSig = useSignal(10);
  const exampleArray = Array.from({length: totalPagesSig.value}, (_, index) => index + 1);

  return (
    <Pagination.Root
    class="pagination-root"
      totalPages={totalPagesSig.value}
      onPageChange$={$((page: number) => {
        selectedPageSig.value = page;
      })}
    >
      <Pagination.Page class="pagination-page"/>
    </Pagination.Root>
  );
});

import styles from "./pagination.css?inline";
