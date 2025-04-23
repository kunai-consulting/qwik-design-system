import { createContextId, type QRL, type Signal, type Component } from "@builder.io/qwik";

// Represents the structure of a single toast managed by the Toaster
export interface ToastData extends ToastOptions {
  id: string; // Ensure ID is always present internally
  // Runtime properties managed by the Toaster:
  isOpenSig: Signal<boolean>; // Signal controlling this toast's visibility
  // Additional runtime properties can be added here
  // e.g., timerId?: unknown;
  // isPaused?: boolean;
}

// --- Programmatic API (via hook/context `useToast`) ---
export interface ToastApi {
  /** Creates and displays a toast, returns its unique ID. */
  add$: QRL<(options: ToastOptions) => string>;
  /** Updates an existing toast by ID. */
  update$: QRL<(id: string, options: Partial<ToastOptions>) => void>;
  /** Dismisses a specific toast by ID. */
  dismiss$: QRL<(id: string) => void>;
  /** Dismisses all toasts. */
  dismissAll$: QRL<() => void>;
}

// Options for creating/updating a toast
export interface ToastOptions {
  /** Provide custom ID, otherwise generated. */
  id?: string;
  /** Main title content for the toast. */
  title?: Component | string;
  /** Main description content for the toast. */
  description?: Component | string;
  /** Optional Action component (e.g., a button). Receives onClick$. */
  action?: Component<{ onClick$: QRL<() => void> }>;
  /** Required accessibility label for the action component. */
  actionAltText?: string;
  /** Show the default close button?
   * @default true
   */
  closeButton?: boolean;
  /** Optional custom Close component (e.g., a button). Receives onClick$. Overrides default if `closeButton` is true. */
  close?: Component<{ onClick$: QRL<() => void> }>;
  /** Override Toaster default duration (ms). 0 for indefinite. */
  duration?: number;
  /** ARIA role for the toast item.
   * @default 'status'
   */
  role?: "status" | "alert";
  /** Show the progress bar visually?
   * @default false
   */
  showProgress?: boolean;
  /** Callback QRL executed when dismissed by any means (user, timer, programmatic). */
  onDismiss$?: QRL<(toastId: string) => void>;
  /** Callback QRL executed specifically when the dismiss timer completes. */
  onAutoClose$?: QRL<(toastId: string) => void>;
  /** Optional CSS class for the Toast Item. Users can add classes here for variant styling. */
  class?: string;
}

// The state provided by the context
export interface ToastContextState extends ToastApi {
  // Signal containing the currently active toasts
  toasts: Signal<ToastData[]>;
  // Add other shared state/config if needed later
  // e.g., defaultDurationSignal: Signal<number>;
  // pauseOnInteractionSignal: Signal<boolean>;
}

export const ToastContextId = createContextId<ToastContextState>("qwik-ui.toast-context");

export interface ToastItemContextState {
  // The data for the specific toast this item represents
  toast: ToastData;
  // The signal indicating if this specific toast is visually open/closed
  isOpenSig: Signal<boolean>;
  // Could add item-specific state signals/methods later if needed
}

export const ToastItemContextId =
  createContextId<ToastItemContextState>("qds-toast-item");
