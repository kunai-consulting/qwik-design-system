import {
  component$,
  type FunctionComponent,
  jsx,
  type JSXNode,
  type JSXOutput,
  type QwikIntrinsicElements,
  Slot
} from "@builder.io/qwik";

// keyof slows the type server a bunch, instead we use the most common fallbacks
type AllowedFallbacks = "div" | "span" | "a" | "button";

export type RenderProps = {
  /** Add in your own component or JSX node */
  render?: JSXNode | JSXOutput;
};

type RenderInternalProps<T extends AllowedFallbacks = "div"> = {
  /** What gets passed to the jsx transform, pass in props.render */
  component: JSXNode | JSXOutput | undefined;
  /** The default element and types if a render prop is not provided */
  fallback: T;
} & QwikIntrinsicElements[T];

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
  <T extends AllowedFallbacks = "div">(props: RenderInternalProps<T>) => {
    const { fallback, component: rawComponent, ...rest } = props;
    const component = rawComponent as {
      type: string | FunctionComponent;
      props: Record<string, unknown>;
    };

    return jsx(component?.type ?? fallback, {
      ...component?.props,
      ...rest,
      children: <Slot />
    });
  }
);
