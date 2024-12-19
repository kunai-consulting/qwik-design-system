import {
  component$,
  type FunctionComponent,
  jsx,
  type JSXNode,
  type JSXOutput,
  type PropsOf,
  Slot
} from "@builder.io/qwik";

export type RenderProps = {
  render?: JSXNode | JSXOutput;
};

type RenderInternalProps = {
  component: JSXNode | JSXOutput | undefined;
  fallback: string;
} & PropsOf<"div">;

export const Render = component$((props: RenderInternalProps) => {
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
});
