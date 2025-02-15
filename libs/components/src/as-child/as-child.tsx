import { component$ } from "@builder.io/qwik";
import type { PropsOf, QwikIntrinsicElements } from "@builder.io/qwik";

type AllowedFallbacks = "div" | "span" | "a" | "button";

type AsChildProps<T extends AllowedFallbacks = "div"> = {
  fallback?: T;
  asChild?: boolean;
} & QwikIntrinsicElements[T];

export const AsChild = (props: AsChildProps) => {
  console.log("children: ", props.children);
  if (props.asChild === true) {
    return <>{props.children}</>;
  }

  console.log("asChild: ", props.asChild);

  if (props.asChild === false) {
    console.log("asChild is false");
  }
  console.log("rest: ", props.children);

  const Comp = props.fallback ?? "div";
  return <Comp {...props}>{props.children}</Comp>;
};
