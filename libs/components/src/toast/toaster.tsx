import {
  $,
  component$,
  type PropsOf,
  useContext,
  useOnDocument,
  useSignal,
  useVisibleTask$
} from "@builder.io/qwik";
import { withAsChild } from "../as-child/as-child";
import { toastContextId } from "./toast-context";
import { ToasterItem } from "./toaster-item";
import { ToasterItemTitle } from "./toaster-item-title";
import { ToasterItemDescription } from "./toaster-item-description";
import { ToasterItemClose } from "./toaster-item-close";
import * as Popover from "../popover";

export const ToasterBase = component$((props: PropsOf<"div">) => {
  const { ...rest } = props;
  const context = useContext(toastContextId);
  const isOpen = useSignal(!!context.currentToast.value);

  useOnDocument(
    "keydown",
    $((event: KeyboardEvent) => {
      if (event.key === "Escape" && context.currentToast.value) {
        context.hide$();
      }
    })
  );

  useVisibleTask$(({ track }) => {
    track(() => context.currentToast.value);
    isOpen.value = !!context.currentToast.value;

    if (context.currentToast.value) {
      const toast = document.querySelector("[data-qds-toaster-item]");
      if (!toast) return;
      
      const focusableElements = toast.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      } else {
        (toast as HTMLElement).focus();
      }
    }
  });

  return (
    <Popover.Root
      open={isOpen.value}
      onChange$={(open) => {
        if (!open && context.currentToast.value) {
          context.hide$();
        }
      }}
    >
      {/* Hidden anchor - not visible but required for popover */}
      <Popover.Anchor style={{ display: "none" }} />

      {/* Custom positioned popover content */}
      <Popover.Content
        {...rest}
        data-qds-toaster
        style={`
          position: fixed; 
          z-index: 9999; 
          max-width: 100%; 
          width: 360px;
        `}
      >
        {context.currentToast.value && (
          <ToasterItem toast={context.currentToast.value}>
            {context.currentToast.value.title && (
              <ToasterItemTitle>{context.currentToast.value.title}</ToasterItemTitle>
            )}
            {context.currentToast.value.description && (
              <ToasterItemDescription>
                {context.currentToast.value.description}
              </ToasterItemDescription>
            )}
            {context.currentToast.value.dismissible && <ToasterItemClose />}
          </ToasterItem>
        )}
      </Popover.Content>
    </Popover.Root>
  );
});

export const Toaster = withAsChild(ToasterBase);
