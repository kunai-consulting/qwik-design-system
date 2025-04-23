import { useContext } from "@builder.io/qwik";
import { ToastContextId, type ToastApi } from "./toast.context";

/**
 * Hook to access the Toaster API for adding, updating, and dismissing toasts.
 */
export const useToast = (): ToastApi => {
  // TODO: Add check for context provider existence
  // const context = useContext(ToastContextId, null);
  // if (!context) {
  //   throw new Error('`useToast` must be used within a `<Toaster.Root>`');
  // }
  return useContext(ToastContextId);
};
