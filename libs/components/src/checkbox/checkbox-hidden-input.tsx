import { component$, useContext, type PropsOf } from "@builder.io/qwik";
import { VisuallyHidden } from "../visually-hidden/visually-hidden";
import { checkboxContextId } from "./checkbox-context";

type CheckboxHiddenNativeInputProps = PropsOf<"input">;

export const CheckboxHiddenNativeInput = component$(
  (props: CheckboxHiddenNativeInputProps) => {
    const context = useContext(checkboxContextId);

    return (
      <VisuallyHidden>
        <input
          type="checkbox"
          checked={context.isCheckedSig.value === true}
          indeterminate={context.isCheckedSig.value === "mixed"}
          data-qds-checkbox-hidden-input
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
