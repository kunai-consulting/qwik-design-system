import { component$, Slot } from "@builder.io/qwik";
import type { QwikIntrinsicElements } from "@builder.io/qwik";

type AllowedElements = "button" | "a" | "div" | "span";

export const PaginationPage = component$(
  <C extends AllowedElements = "button">(
    props: QwikIntrinsicElements[C] & { as?: C }
  ) => {
    const { as, ...rest } = props;
    const Comp = as ?? "button";

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp data-qds-pagination-page {...rest}>
          <Slot />
        </Comp>
      </>
    );
  }
);
