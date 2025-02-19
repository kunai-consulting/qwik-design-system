import {
  component$,
  useContext,
  type PropsOf,
  Slot
} from "@builder.io/qwik";
import { toastContextId } from "./toast-context";

type PublicContentProps = PropsOf<"div">;

export const ToastContent = component$<PublicContentProps>((props) => {
  const context = useContext(toastContextId);

  return (
    <div
      {...props}
      data-qds-toast-content
      data-state={context.isOpen.value ? "visible" : "hidden"}
    >
      <Slot />
    </div>
  );
});
