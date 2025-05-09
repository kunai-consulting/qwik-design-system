import { type PropsOf, Slot, component$, useContext, useTask$ } from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { Render } from "../render/render";
import { checkboxContextId } from "./checkbox-context";
import { assertComponentIsPresent } from "@kunai-consulting/qwik-utils";
type PublicCheckboxDescriptionProps = PropsOf<"div">;
/** A component that renders the description text for a checkbox */
export const CheckboxDescriptionBase = component$(
  (props: PublicCheckboxDescriptionProps) => {
    const context = useContext(checkboxContextId);
    const descriptionId = `${context.localId}-description`;

    useTask$(() => {
      assertComponentIsPresent(context.componentChecker, "description", "Description");
    });

    return (
      // Identifier for the checkbox description element
      <Render fallback="div" id={descriptionId} data-qds-checkbox-description {...props}>
        <Slot />
      </Render>
    );
  }
);

export const CheckboxDescription = withAsChild(CheckboxDescriptionBase);
