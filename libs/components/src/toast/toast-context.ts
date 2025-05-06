import { type Signal, createContextId } from "@builder.io/qwik";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  duration?: number;
  dismissible?: boolean;
};

export type ToastQueue = Toast[];

export type ToastContext = {
  localId: string;
  toastQueue: Signal<ToastQueue>;
  currentToast: Signal<Toast | null>;
  duration: Signal<number>;
  pauseOnHover: Signal<boolean>;
  show$: (toast: Omit<Toast, "id">) => void;
  hide$: () => void;
};

export const toastContextId = createContextId<ToastContext>("qds-toast");
