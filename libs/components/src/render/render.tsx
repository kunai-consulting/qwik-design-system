import {
  $,
  type JSXOutput,
  type QwikIntrinsicElements,
  type Signal,
  Slot,
  component$
} from "@builder.io/qwik";
import type { AsChildProps } from "../as-child/as-child";

// keyof slows the type server a bunch, instead we use the most common fallbacks
type AllowedFallbacks = "div" | "span" | "a" | "button" | "label";

type RenderInternalProps<T extends AllowedFallbacks> = {
  /** The default element and types if a render prop is not provided */
  fallback: T;
  externalRef: unknown;
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
    const { fallback, _jsxType, _allProps, asChild, externalRef, ...rest } = props;

    fallback;
    _jsxType;
    externalRef;

    const Comp = props._jsxType ?? props.fallback;

    return (
      <Comp
        {...rest}
        {...props._allProps}
        ref={$((el: HTMLElement) => {
          if (props.ref) {
            (props.ref as Signal<HTMLElement>).value = el;
          }

          if (props.externalRef) {
            (props.externalRef as Signal<HTMLElement>).value = el;
          }
        })}
      >
        <Slot />
      </Comp>
    );
  }
);
