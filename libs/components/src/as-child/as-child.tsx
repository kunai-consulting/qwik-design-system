import { Component, noSerialize, JSXChildren, sync$ } from "@builder.io/qwik";
import { FunctionComponent } from "@builder.io/qwik/jsx-runtime";

export type AsChildProps = {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

export function syncFixedInV2<T extends Function>(fn: T) {
  // in v1, there is a very obscure bug with container state and context
  // that is fixed with the new serialization system in v2
  return noSerialize(fn);
}

export function withAsChild<T>(BaseComponent: Component<T>) {
  return function AsChildWrapper(props: T & AsChildProps) {
    const children = (props as any).children;

    if (!props.asChild) {
      return <BaseComponent {...(props as any)}>{children}</BaseComponent>;
    }

    if (children.length > 1) {
      throw new Error(
        "Qwik Design System: When using asChild, there can only be one descendant or children JSX Node. Look for the asChild prop and see where two nodes are."
      );
    }

    const allProps = {
      ...children.props,
      ...children.immutableProps,
    };
    const { children: _, ...restProps } = allProps;

    const name = (children.type as { name: string }).name;
    let jsxType;

    if (name === "QwikComponent" || typeof children.type === "string") {
      jsxType = children.type;
    } else {
      jsxType = noSerialize(children.type as FunctionComponent);
    }

    return (
      <BaseComponent
        {...(props as any)}
        _jsxType={jsxType}
        _allProps={restProps}
      >
        {(children.children ?? children.props?.children) as JSXChildren}
      </BaseComponent>
    );
  };
}
