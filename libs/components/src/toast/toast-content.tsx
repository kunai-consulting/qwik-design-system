import { type PropsOf, Slot, component$, useContext } from "@builder.io/qwik";
import { toastContextId } from "./toast-context";

type PublicContentProps = PropsOf<"div">;

/** A content component that displays the toast message or elements */
export const ToastContent = component$<PublicContentProps>((props) => {
  const context = useContext(toastContextId);

  return (
    <div
      {...props}
      // The identifier for the toast content container
      data-qds-toast-content
      // Indicates the visibility state of the toast content (visible or hidden)
      data-state={context.isOpen.value ? "visible" : "hidden"}
    >
      <Slot />
    </div>
  );
});
