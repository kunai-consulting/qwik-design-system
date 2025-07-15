import { useSignal, useSignals } from "@preact/signals-react/runtime";
import {
  signal as reactSignal,
  type Signal as ReactSignal,
  type ReadonlySignal
} from "@preact/signals-react";
// import { Signal } from "@preact/signals-core";

type TaskCleanup = () => void;

type TrackingContext = {
  track: <T>(fn: () => T) => T;
  cleanup: (cleanupFn: TaskCleanup) => void;
};

type ImplicitTrackingTask = () => TaskCleanup | undefined;
type ExplicitTrackingTask = (context: TrackingContext) => Promise<void> | void;

export type Signal<T> = ReactSignal<T>;

export type Computed<T> = ReadonlySignal<Computed<T>>;

export type ReactivityAdapter = {
  framework: "qwik" | "react";
  signal: <T>(initialValue: T) => Signal<T>;
  computed: <T>(computeFn: () => T) => Computed<T>;
  task: (taskFn: ExplicitTrackingTask) => TaskCleanup | undefined;
  fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  boundSignal: <T>(input: any, defaultValue: T) => Signal<T>;
};

function isSignal<T = any>(val: any): val is Signal<T> {
  return (
    val && typeof val === "object" && "value" in val && typeof val.value !== "function"
  );
}

export function useRuntime(runtime: ReactivityAdapter) {
  // TODO: check if a root context exists that specifics framework, if so skip the need for the adapter argument in each hook call.
  // console.log("useRuntime", runtime.framework);

  if (runtime.framework !== "react") {
    return runtime;
  }

  // React and Preact need to initialize signals. This is purposely a dev dependency, the CLI should install the @preact/signals-react in React apps.
  useSignals();

  return runtime;
}

/**
 * This is "auto-tracking". For example, in useComputed(() => mySig.value). Whenever mySig's value is changed the computed will re-run.
 *
 * This happens for both computeds, and preact's regular effects.
 */
export function createReactivityAdapter(
  framework: "qwik",
  hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (taskFn: ExplicitTrackingTask) => void;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  }
): ReactivityAdapter;

export function createReactivityAdapter(
  framework: "react",
  hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (cb: () => (() => void) | undefined) => void;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
  }
): ReactivityAdapter;

export function createReactivityAdapter(
  framework: "qwik" | "react",
  hooks: Record<string, unknown>
): ReactivityAdapter {
  const typedHooks = hooks as {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (cb: () => (() => void) | undefined) => void;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
    boundSignal: <T>(input: any, defaultValue: T) => Signal<T>;
  };

  return {
    framework,
    signal: typedHooks.signal,
    computed: typedHooks.computed,
    task: (taskFn) => {
      if (framework === "qwik") {
        // For Qwik, we need to cast through unknown first
        (typedHooks.task as unknown as (taskFn: ExplicitTrackingTask) => void)(taskFn);
        return undefined;
      }

      // Convert React's implicit tracking to our explicit tracking
      let cleanup: TaskCleanup | undefined;
      typedHooks.task(() => {
        const result = taskFn({
          track: (fn) => fn(),
          cleanup: (fn) => {
            cleanup = fn;
            return fn;
          }
        });
        if (typeof result === "function") {
          cleanup = result;
          return result;
        }
        return undefined;
      });
      return cleanup;
    },
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => fn,
    boundSignal: (input, defaultValue) => {
      if (framework === "react") {
        console.log("boundSignal", input, defaultValue);

        if (isSignal(input)) {
          return input;
        }
        return reactSignal(input ?? defaultValue);
      }
      return useSignal(input ?? defaultValue);
    }
  };
}

/**
 * Takes a Qwik-style explicit tracking task and converts it to React signals implicit tracking effect.
 */
export function convertToReactEffect(
  qwikTask: ExplicitTrackingTask,
  reactEffect: (fn: ImplicitTrackingTask) => TaskCleanup | undefined
): TaskCleanup | undefined {
  let cleanupFn: TaskCleanup | undefined;

  return reactEffect(() => {
    const reactContext: TrackingContext = {
      track: <T>(fn: () => T): T => {
        return fn();
      },
      cleanup: (fn: TaskCleanup) => {
        cleanupFn = fn;
      }
    };

    try {
      qwikTask(reactContext);
    } catch (error) {
      console.error("Error in React task:", error);
    }

    return cleanupFn;
  });
}
