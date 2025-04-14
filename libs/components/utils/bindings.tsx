import { type Signal, useComputed$ } from "@builder.io/qwik";
import { useBoundSignal } from "./bound-signal";

/**
 * Props that support both value and signal binding
 *
 * @example
 * <Component value="direct" />
 * <Component bind:value={mySignal} />
 */
export type BindableProps<T> = {
  [K in keyof T]?: T[K];
} & {
  [K in keyof T as `bind:${string & K}`]?: Signal<T[K]>;
};

/**
 * Signals returned by useBindings with Sig suffix
 */
type SignalResults<T> = {
  [K in keyof T as `${string & K}Sig`]: Signal<T[K]>;
};

/**
 * Creates bound signals for component properties
 *
 * @param props Component props (both regular and bind: variants)
 * @param defaults Default values
 * @returns Object with signals for each property (with Sig suffix)
 *
 * @example
 * const { disabledSig, valueSig } = useBindings(props, {
 *   disabled: false,
 *   value: ""
 * });
 */
export function useBindings<T extends Record<string, unknown>>(
  props: BindableProps<T>,
  defaults: { [K in keyof T]: T[K] }
): SignalResults<T> {
  const result = {} as SignalResults<T>;

  for (const key in defaults) {
    const propSig = useComputed$(
      () => props[key as keyof typeof props] as T[typeof key] | undefined
    );

    const bindKey = `bind:${key}` as `bind:${string & typeof key}`;

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
