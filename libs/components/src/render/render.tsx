import {
  component$,
  type FunctionComponent,
  jsx,
  type JSXNode,
  type JSXOutput,
  type QwikIntrinsicElements,
  Slot
} from "@builder.io/qwik";

type AllowedFallbacks = "div" | "span" | "a" | "button";

export type RenderProps = {
  render?: JSXNode | JSXOutput;
};

type RenderInternalProps<T extends AllowedFallbacks = "div"> = {
  component: JSXNode | JSXOutput | undefined;
  fallback: T;
} & QwikIntrinsicElements[T];

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
