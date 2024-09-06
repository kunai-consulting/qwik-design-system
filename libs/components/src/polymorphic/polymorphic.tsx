import { component$, Slot } from "@builder.io/qwik";
import type { QwikIntrinsicElements } from "@builder.io/qwik";

type AllowedElements = "button" | "a" | "div" | "span";

export const Polymorphic = component$(
  <C extends AllowedElements = "button">(
    props: QwikIntrinsicElements[C] & { as?: C }
  ) => {
    const { as, ...rest } = props;
    const Comp = as ?? "button";

    return (
      <>
        {/* @ts-expect-error annoying polymorphism */}
        <Comp {...rest}>
          <Slot />
        </Comp>
      </>
    );
  }
);
