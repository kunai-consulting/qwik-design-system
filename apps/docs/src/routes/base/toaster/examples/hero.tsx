import { component$, useStyles$ } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";
import styles from "./toaster.css?inline";

/**
 * Basic Toaster setup. This example only renders the viewport.
 * Toasts need to be added programmatically using the `useToast` hook.
 */
export default component$(() => {
  useStyles$(styles);

  return (
    // The Toaster.Root acts as the viewport where toasts will appear.
    // It needs to be rendered once, high up in your application tree.
    <Toaster.Root />
    // Add buttons or other UI here to trigger toasts via useToast().
  );
});
