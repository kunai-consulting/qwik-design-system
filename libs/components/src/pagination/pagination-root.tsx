import { type PropsOf, Slot, component$ } from "@builder.io/qwik";
import { usePagination } from "@kunai-consulting/qwik-hooks";

export const PaginationRoot = ({ children }: PropsOf<"div">) => {
  return <PaginationBase>{children}</PaginationBase>;
};

const PaginationBase = component$(() => {
  return (
    <div>
      <Slot />
    </div>
  );
});
