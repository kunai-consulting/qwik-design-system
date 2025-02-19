import { Component, noSerialize, JSXChildren } from "@builder.io/qwik";
import { FunctionComponent } from "@builder.io/qwik/jsx-runtime";

export type AsChildProps = {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

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

    const { children: childrenProp, ..._allProps } = {
      ...children.props,
      ...children.immutableProps,
    };

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
        _allProps={_allProps}
      >
        {(children.children ?? children.props?.children) as JSXChildren}
      </BaseComponent>
    );
  };
}
