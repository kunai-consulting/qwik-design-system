type TaskCleanup = () => void;

type TrackingContext = {
  track: <T>(fn: () => T) => T;
  cleanup: (cleanupFn: TaskCleanup) => void;
};

/**
 * This is "auto-tracking". For example, in useComputed(() => mySig.value). Whenever mySig's value is changed the computed will re-run.
 *
 * This happens for both computeds, and preact's regular effects.
 */
type ImplicitTrackingTask = () => TaskCleanup | undefined;

/**
 * Qwik-style explicit tracking with track() and cleanup() calls
 */
type ExplicitTrackingTask = (context: TrackingContext) => Promise<void> | void;

export type Signal<T> = {
  value: T;
};

export type Computed<T> = {
  value: T;
};

export type ReactivityAdapter = {
  signal: <T>(initialValue: T) => Signal<T>;
  computed: <T>(computeFn: () => T) => Computed<T>;
  task: (taskFn: ExplicitTrackingTask) => TaskCleanup | undefined;
  framework: "qwik" | "react";
};

export function createReactivityAdapter(
  framework: "qwik",
  hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (taskFn: ExplicitTrackingTask) => void;
  }
): ReactivityAdapter;

export function createReactivityAdapter(
  framework: "react",
  hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (cb: () => (() => void) | undefined) => void;
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
