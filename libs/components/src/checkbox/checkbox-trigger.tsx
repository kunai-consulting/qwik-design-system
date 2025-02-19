import {
  $,
  Component,
  type PropsOf,
  Slot,
  component$,
  noSerialize,
  sync$,
  useComputed$,
  useContext,
  JSXNode,
  FunctionComponent,
  JSXChildren,
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
import { Render } from "../render/render";
type PublicCheckboxControlProps = PropsOf<"button"> & {
  _allProps?: object;
  _jsxType?: Component | string;
  asChild?: boolean;
};

export function CheckboxTrigger(props: PublicCheckboxControlProps) {
  const children = props.children as JSXNode;

  if (!props.asChild) {
    return <CheckboxTriggerBase {...props}>{children}</CheckboxTriggerBase>;
  }

  let jsxType;

  const { children: childrenProp, ..._allProps } = {
    ...children.props,
    ...children.immutableProps,
  };

  const name = (children.type as { name: string }).name;

  if (name === "QwikComponent" || typeof children.type === "string") {
    jsxType = children.type;
  } else {
    jsxType = noSerialize(children.type as FunctionComponent);
  }

  return (
    <CheckboxTriggerBase
      {...props}
      _jsxType={children.type as string | Component | undefined}
      _allProps={_allProps}
    >
      {(children.children ?? children.props?.children) as JSXChildren}
    </CheckboxTriggerBase>
  );
}

/** Interactive trigger component that handles checkbox toggling */
export const CheckboxTriggerBase = component$(
  (props: PublicCheckboxControlProps) => {
    const context = useContext(checkboxContextId);
    const triggerId = `${context.localId}-trigger`;
    const descriptionId = `${context.localId}-description`;
    const errorId = `${context.localId}-error`;
    const describedByLabels = useComputed$(() => {
      const labels = [];
      if (context.isDescription) {
        labels.push(descriptionId);
      }
      if (context.isErrorSig.value) {
        labels.push(errorId);
      }
      return labels.join(" ") || undefined;
    });
    const handleClick$ = $(() => {
      if (context.isCheckedSig.value === "mixed") {
        context.isCheckedSig.value = true;
      } else {
        context.isCheckedSig.value = !context.isCheckedSig.value;
      }
    });
    const handleKeyDownSync$ = sync$((e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
      }
    });

    return (
      <Render
        id={triggerId}
        ref={context.triggerRef}
        type="button"
        role="checkbox"
        fallback="button"
        aria-checked={`${context.isCheckedSig.value}`}
        aria-describedby={
          describedByLabels ? describedByLabels.value : undefined
        }
        aria-invalid={context.isErrorSig.value}
        disabled={context.isDisabledSig.value}
        // Indicates whether the checkbox trigger is disabled
        data-disabled={context.isDisabledSig.value ? "" : undefined}
        onKeyDown$={[props.onKeyDown$]}
        onClick$={[handleClick$, props.onClick$]}
        // Indicates whether the checkbox trigger is checked
        data-checked={
          context.isCheckedSig.value && context.isCheckedSig.value !== "mixed"
            ? ""
            : undefined
        }
        // Indicates whether the checkbox trigger is in an indeterminate state
        data-mixed={context.isCheckedSig.value === "mixed" ? "" : undefined}
        // Identifier for the checkbox trigger element
        data-qds-checkbox-trigger
        {...props}
      >
        <Slot />
      </Render>
    );
  }
);
