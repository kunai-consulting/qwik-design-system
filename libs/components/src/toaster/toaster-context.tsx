import { type Signal, createContextId } from "@builder.io/qwik";

export interface ToastData {
  id: string;
  open: boolean;
  title?: string;
  description?: string;
  duration?: number;
}

export interface ToasterContext {
  toastsSig: Signal<ToastData[]>;
  limit?: number;
  gap?: number;
  duration: number;
  createToast: (data: Partial<ToastData>) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

export const toasterContextId = createContextId<ToasterContext>("toaster-context");
