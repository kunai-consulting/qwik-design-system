import { component$, type PropsOf, Slot, useContext, useTask$ } from "@builder.io/qwik";
import { checkboxContextId } from "./checkbox-context";

type CheckboxDescriptionProps = PropsOf<"div">;

export const CheckboxDescription = component$((props: CheckboxDescriptionProps) => {
  const context = useContext(checkboxContextId);
  const descriptionId = `${context.localId}-description`;

  useTask$(({ cleanup }) => {
    context.isDescriptionSig.value = true;

    cleanup(() => {
      context.isDescriptionSig.value = false;
    });
  });

  return (
    <div id={descriptionId} {...props}>
      <Slot />
    </div>
  );
});
