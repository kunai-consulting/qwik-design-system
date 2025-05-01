import { type Signal, createContextId } from "@builder.io/qwik";

export type ToastType = "success" | "error" | "info" | "warning";

export type Toast = {
  id: string;
  type?: ToastType;
  title?: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
};

export type ToastContext = {
  localId: string;
  currentToast: Signal<Toast | null>;
  duration: Signal<number>;
  pauseOnHover: Signal<boolean>;
  show$: (toast: Omit<Toast, "id">) => void;
  hide$: () => void;
};

export const toastContextId = createContextId<ToastContext>("qds-toast");
