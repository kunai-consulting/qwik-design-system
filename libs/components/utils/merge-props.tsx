import { jsx } from "@builder.io/qwik";

export type AsChildProps<T> = {
  children: Element;
  asChild?: boolean;
} & T;

const overrideProps = (node: any, props: any) => {
  for (const name in Object.keys(props)) {
    if (typeof name !== "symbol") {
      node.props[name] = props[name];
    }
  }
  return node;
};

export const asChild = <C extends object>(Component: C) => {
  return <T extends object>({ asChild, children, ...props }: AsChildProps<T>) => {
    if (!asChild) {
      return <Component {...props}>{children}</Component>;
    }

    if (!children || Array.isArray(children)) {
      throw new Error("requires single child");
    }

    // Create new element using Qwik's jsx function
    return (
      <children.type {...children.props} {...props}>
        {children.children || children.props.children}
      </children.type>
    );
  };
};
