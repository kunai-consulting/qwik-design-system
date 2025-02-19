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
} from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";
type PublicCheckboxControlProps = PropsOf<"button"> & {
  allProps?: unknown;
  jsxType?: Component | string;
  asChild?: boolean;
};

export function CheckboxTrigger(props: PublicCheckboxControlProps) {
  if (!props.asChild) {
    return (
      <CheckboxTriggerBase {...props}>{props.children}</CheckboxTriggerBase>
    );
  }

  let jsxType;

  console.log("props: ", props.children);

  const { children, ...allProps } = {
    ...props.children.props,
    ...props.children.immutableProps,
  };

  console.log("all props: ", allProps);

  console.log("jsx type: ", props.children.type);

  console.log("is true: ", props.children.type.name === "QwikComponent");

  if (props.children.type.name === "QwikComponent") {
    jsxType = props.children.type;
  } else {
    jsxType = noSerialize(props.children.type);
  }

  return (
    <CheckboxTriggerBase
      {...props}
      jsxType={props.children.type}
      allProps={allProps}
    >
      {props.children.children ?? props.children.props?.children}
    </CheckboxTriggerBase>
  );
}

/** Interactive trigger component that handles checkbox toggling */
export const CheckboxTriggerBase = component$(
  (props: PublicCheckboxControlProps) => {
    const Comp = props.jsxType ?? "button";

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
      <Comp
        id={triggerId}
        ref={context.triggerRef}
        type="button"
        role="checkbox"
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
        {...props.allProps}
      >
        <Slot />
      </Comp>
    );
  }
);
