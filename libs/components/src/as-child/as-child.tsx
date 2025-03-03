import {
  type Component,
  noSerialize,
  type JSXChildren,
  type NoSerialize
} from "@builder.io/qwik";
import type { FunctionComponent } from "@builder.io/qwik/jsx-runtime";

export type AsChildProps = {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

export function syncFixedInV2<T extends (...args: unknown[]) => unknown>(fn: T) {
  // in v1, there is a very obscure bug with container state and context
  // that is fixed with the new serialization system in v2
  return noSerialize(fn);
}

export function withAsChild<T>(BaseComponent: Component<T>, trackInstances?: boolean) {
  let count = 0;

  return function AsChildWrapper(props: T & AsChildProps) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const children = (props as any).children;

    let indexCount: number | undefined;

    if (trackInstances === true) {
      indexCount = count++;
    }

    if (!props.asChild) {
      return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        <BaseComponent {...(props as any)} _index={indexCount}>
          {children}
        </BaseComponent>
      );
    }

    if (children.length > 1) {
      throw new Error(
        "Qwik Design System: When using asChild, there can only be one descendant or children JSX Node. Look for the asChild prop and see where two nodes are."
      );
    }

    const allProps = {
      ...children.props,
      ...children.immutableProps
    };
    const { children: _, ...restProps } = allProps;

    const name = (children.type as { name: string }).name;
    let jsxType: string | FunctionComponent | NoSerialize<FunctionComponent>;

    if (name === "QwikComponent" || typeof children.type === "string") {
      jsxType = children.type;
    } else {
      jsxType = noSerialize(children.type as FunctionComponent);
    }

    return (
      <BaseComponent
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        {...(props as any)}
        _jsxType={jsxType}
        _allProps={restProps}
        _index={indexCount}
      >
        {(children.children ?? children.props?.children) as JSXChildren}
      </BaseComponent>
    );
  };
}
