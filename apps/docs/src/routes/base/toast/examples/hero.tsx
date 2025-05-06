import { component$, useContext, useStyles$ } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";
import styles from "./toaster-custom.css?inline";

// Create a component to display toasts
export const ToastDisplay = component$(() => {
  useStyles$(styles);
  const context = useContext(Toaster.toastContextId);

  return (
    <>
      {context.currentToast.value && (
        <div data-qds-toaster class="toast-container">
          <Toaster.Item toast={context.currentToast.value}>
            {context.currentToast.value.title && (
              <Toaster.ItemTitle>{context.currentToast.value.title}</Toaster.ItemTitle>
            )}
            {context.currentToast.value.description && (
              <Toaster.ItemDescription>
                {context.currentToast.value.description}
              </Toaster.ItemDescription>
            )}
            {context.currentToast.value.dismissible && <Toaster.ItemClose />}
          </Toaster.Item>
        </div>
      )}
    </>
  );
});

export default component$(() => {
  useStyles$(styles);

  return (
    <Toaster.Root duration={3000} pauseOnHover>
      <div class="flex flex-wrap gap-2">
        <Toaster.Trigger
          title="Example Toast"
          description="This is an example toast."
          class="success"
        >
          Example Toast
        </Toaster.Trigger>
      </div>

      {/* Add the toast display component */}
      <ToastDisplay />
    </Toaster.Root>
  );
});
