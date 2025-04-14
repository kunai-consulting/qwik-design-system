import { type Signal, useComputed$ } from "@builder.io/qwik";
import { useBoundSignal } from "./bound-signal";

/**
 * Props that support both value based and signal based state
 *
 * @example
 * <Component value="jim" /> // value={signal.value}, value={store.property}
 * <Component bind:value={mySignal} />
 */
export type BindableProps<T> = {
  [K in keyof T]?: T[K];
} & {
  [K in keyof T as `bind:${string & K}`]?: Signal<T[K]>;
};

/**
 * Signals returned by useBindings with Sig suffix
 *
 * @example
 * If T is { value: string, disabled: boolean }
 * Then SignalResults<T> is { valueSig: Signal<string>, disabledSig: Signal<boolean> }
 */
export type SignalResults<T> = {
  [K in keyof T as `${string & K}Sig`]: Signal<T[K]>;
};

/**
 * Creates synchronized signals that support both signal based state and resolved value state
 *
 * @param props Component props
 * @param initialValues
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
  initialValues: T
): SignalResults<T> {
  const result = {} as SignalResults<T>;

  for (const key in initialValues) {
    type PropType = T[typeof key];
    type PropSignal = Signal<PropType>;
    type BindSignal = PropSignal | undefined;

    const propSig = useComputed$<PropType | undefined>(
      () => props[key] as PropType | undefined
    );
    const bindKey = `bind:${key}`;
    const resultKey = `${key}Sig` as keyof SignalResults<T>;

    const bindSignal = props[bindKey as keyof typeof props] as BindSignal;
    const initialValue = bindSignal?.value ?? propSig.value ?? initialValues[key];

    result[resultKey] = useBoundSignal(
      bindSignal,
      initialValue,
      propSig
    ) as SignalResults<T>[typeof resultKey];
  }

  return result;
}
