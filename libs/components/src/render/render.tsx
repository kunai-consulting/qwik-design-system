import {
  type JSXOutput,
  type QwikIntrinsicElements,
  Slot,
  component$
} from "@builder.io/qwik";
import type { AsChildProps } from "../as-child/as-child";

// keyof slows the type server a bunch, instead we use the most common fallbacks
type AllowedFallbacks = "div" | "span" | "a" | "button";

type RenderInternalProps<T extends AllowedFallbacks> = {
  /** The default element and types if a render prop is not provided */
  fallback: T;
} & QwikIntrinsicElements[T] &
  AsChildProps;

/**
 * Render component enables flexible composition by allowing a component to be rendered with a fallback
 * element type.
 *
 * It accepts a _jsxType prop for custom rendering, and falls back to a specified HTML element
 * (div, span, a, button) if no component is provided.
 *
 * This allows components and JSX nodes to be composed with asChild while maintaining proper typing and
 * accessibility.
 */
export const Render = component$(
  <T extends AllowedFallbacks>(props: RenderInternalProps<T>): JSXOutput => {
    const { fallback, _jsxType, _allProps, asChild, ...rest } = props;

    fallback;
    _jsxType;

    const Comp = props._jsxType ?? props.fallback;

    return (
      <Comp {...rest} {...props._allProps}>
        <Slot />
      </Comp>
    );
  }
);
