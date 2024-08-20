import { type Signal, createContextId } from '@builder.io/qwik';

export interface OTPContext {
  value: Signal<string>;
  activeIndexSig: Signal<number>;
  nativeInputRef: Signal<HTMLInputElement | undefined>;
  numItemsSig: Signal<number>;
  fullEntrySig: Signal<boolean>;
}

export const OTPContextId = createContextId<OTPContext>('OTPContext');
