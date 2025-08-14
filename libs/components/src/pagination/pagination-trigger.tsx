import { $, type PropsOf, Slot, component$, useContext } from "@qwik.dev/core";
import { Render } from "../render/render";
import { paginationContextId } from "./pagination-context";

type NavigationDirection = "previous" | "next";
type NavigationPosition = "first" | "last";

export const usePaginationNavigation = (direction: NavigationDirection) => {
  const context = useContext(paginationContextId);
  const { selectedPage } = context;

  const navigate = $((position?: NavigationPosition) => {
    if (position === "first") {
      selectedPage.value = 1;
      return;
    }
    if (position === "last") {
      // Consumer should handle last page logic if needed
      return;
    }
    if (direction === "previous") {
      if (selectedPage.value <= 1) return;
      selectedPage.value -= 1;
      return;
    }
    if (direction === "next") {
      // Consumer should handle max page validation if needed
      selectedPage.value += 1;
      return;
    }
  });

  return {
    navigate,
    context
  };
};

/** Previous page navigation button component */
export const PaginationPrevTrigger = component$(
  ({ type, ...props }: PropsOf<"button">) => {
    const { navigate } = usePaginationNavigation("previous");

    const handleBackward = $(async () => {
      await navigate();
    });

    return (
      <Render
        {...props}
        fallback="button"
        // Identifies the pagination previous button element
        data-qds-pagination-previous
        type="button"
        onClick$={[handleBackward, props.onClick$]}
      >
        <Slot />
      </Render>
    );
  }
);

/** Next page navigation button component */
export const PaginationNextTrigger = component$(
  ({ type, ...props }: PropsOf<"button">) => {
    const { navigate } = usePaginationNavigation("next");

    const handleForward = $(async () => {
      await navigate();
    });

    return (
      <Render
        {...props}
        fallback="button"
        // Identifies the pagination next button element
        data-qds-pagination-next
        type="button"
        onClick$={[handleForward, props.onClick$]}
      >
        <Slot />
      </Render>
    );
  }
);
