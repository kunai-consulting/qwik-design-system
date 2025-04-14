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
export type SignalResults<T> = {
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
export function useBindings<T extends object>(
  props: BindableProps<T>,
  defaults: T
): SignalResults<T> {
  const result = {} as SignalResults<T>;

  for (const key in defaults) {
    type PropType = T[typeof key];
    type PropSignal = Signal<PropType>;
    type BindSignal = PropSignal | undefined;

    const propSig = useComputed$<PropType | undefined>(
      () => props[key] as PropType | undefined
    );
    const bindKey = `bind:${key}`;
    const resultKey = `${key}Sig` as keyof SignalResults<T>;

    const bindSignal = props[bindKey as keyof typeof props] as BindSignal;
    const initialValue = bindSignal?.value ?? propSig.value ?? defaults[key];

    result[resultKey] = useBoundSignal(
      bindSignal,
      initialValue,
      propSig
    ) as SignalResults<T>[typeof resultKey];
  }

  return result;
}
