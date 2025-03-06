import {
  type Component,
  type JSXChildren,
  type NoSerialize,
  noSerialize
} from "@builder.io/qwik";
import type { FunctionComponent } from "@builder.io/qwik/jsx-runtime";

export type AsChildProps = {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function syncFixedInV2<T extends (...args: any[]) => unknown>(fn: T) {
  // in v1, there is a very obscure bug with container state and context
  // that is fixed with the new serialization system in v2
  return noSerialize(fn) as T;
}

export function withAsChild<T>(
  BaseComponent: Component<T>,
  trackInstances?: boolean,
  fn?: (props: T & AsChildProps) => T & AsChildProps
) {
  let count = 0;

  return function AsChildWrapper(props: T & AsChildProps) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const children = (props as any).children;

    // standard indexing, if you want hierarchical indexing, or any other functionality, you can use the callback function to inject your own logic
    let indexCount: number | undefined;

    if (trackInstances === true) {
      indexCount = count++;
    }

    let moreProps: (T & AsChildProps) | undefined;

    if (fn) {
      moreProps = fn(props);
    }

    if (!props.asChild) {
      return (
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        <BaseComponent {...(props as any)} _index={indexCount} {...moreProps}>
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
