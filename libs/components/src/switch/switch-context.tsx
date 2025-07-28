import { type Signal, createContextId } from "@qwik.dev/core";

export interface SwitchContext {
  checked: Signal<boolean>;
  disabled: Signal<boolean>;
  required: Signal<boolean>;
  name?: Signal<string | undefined>;
  value?: Signal<string | undefined>;
  onChange$?: (checked: boolean) => void;
  localId: string;
  hasError?: boolean;
  hasErrorMessage: Signal<boolean>;
}

export const switchContextId = createContextId<SwitchContext>("switch-context");
