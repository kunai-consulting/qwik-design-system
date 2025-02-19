import {
  Component,
  type JSXNode,
  type JSXOutput,
  type QwikIntrinsicElements,
  Slot,
  component$,
  jsx,
} from "@builder.io/qwik";

// keyof slows the type server a bunch, instead we use the most common fallbacks
type AllowedFallbacks = "div" | "span" | "a" | "button";

export type RenderProps = {
  /** Add in your own component or JSX node */
  render?: JSXNode | JSXOutput;
};

type AsChildProps = {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

type RenderInternalProps<T extends AllowedFallbacks> = {
  /** The default element and types if a render prop is not provided */
  fallback: T;
} & QwikIntrinsicElements[T] &
  AsChildProps;

/**
 * Render component enables flexible composition by allowing a component to be rendered with a fallback
 * element type.
 *
 * It accepts a component prop for custom rendering, and falls back to a specified HTML element
 * (div, span, a, button) if no component is provided.
 *
 * This allows components and JSX nodes to be composed while maintaining proper typing and
 * accessibility.
 */
export const Render = component$(
  <T extends AllowedFallbacks>(props: RenderInternalProps<T>) => {
    const { fallback, _jsxType, _allProps, asChild, ...rest } = props;

    const Comp = _jsxType ?? fallback;

    return (
      <Comp {..._allProps} {...rest}>
        <Slot />
      </Comp>
    );
  }
) as {
  <T extends AllowedFallbacks>(props: RenderInternalProps<T>): JSXOutput;
};
