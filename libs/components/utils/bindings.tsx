import { type Signal, useComputed$ } from "@builder.io/qwik";
import { useBoundSignal } from "./bound-signal";

/**
 * Type for props with both regular and bind: properties
 */
export type BindableProps<T> = {
  [K in keyof T]?: T[K];
} & {
  [K in keyof T as `bind:${string & K}`]?: Signal<T[K]>;
};

/**
 * Type for the signals object returned by useBindings, adding Sig suffix
 */
type SignalResults<T> = {
  [K in keyof T as `${string & K}Sig`]: Signal<T[K]>;
};

/**
 * Creates bound signals for multiple properties with automatic Sig suffix.
 * Supports both two-way binding with bind: signals and one-way props.
 *
 * @param props The component props with both regular and bind: properties
 * @param defaults Default values that define the properties to bind
 * @returns Object with signals for each property, named with Sig suffix
 *
 * @example
 * const { disabledSig, valueSig } = useBindings(props, {
 *   disabled: false,
 *   value: ""
 * });
 *
 * return <button disabled={disabledSig.value}>{valueSig.value}</button>;
 */
export function useBindings<T extends Record<string, unknown>>(
  props: BindableProps<T>,
  defaults: { [K in keyof T]: T[K] }
): SignalResults<T> {
  const result = {} as SignalResults<T>;

  for (const key in defaults) {
    const bindKey = `bind:${key}` as `bind:${string & typeof key}`;
    const propSig = useComputed$(
      () => props[key as keyof typeof props] as T[typeof key] | undefined
    );

    const resultKey = `${String(key)}Sig` as keyof SignalResults<T>;
    result[resultKey] = useBoundSignal(
      props[bindKey] as Signal<T[typeof key]> | undefined,
      (props[bindKey] as Signal<T[typeof key]> | undefined)?.value ??
        propSig.value ??
        defaults[key],
      propSig
    ) as SignalResults<T>[keyof SignalResults<T>];
  }

  return result;
}
