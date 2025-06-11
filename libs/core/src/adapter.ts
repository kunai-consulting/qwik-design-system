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
  task: (taskFn: ImplicitTrackingTask | ExplicitTrackingTask) => TaskCleanup | undefined;
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
    task: (taskFn: ImplicitTrackingTask) => TaskCleanup | undefined;
  }
): ReactivityAdapter;

export function createReactivityAdapter(
  framework: "qwik" | "react",
  hooks: Record<string, unknown>
): ReactivityAdapter {
  const typedHooks = hooks as {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (taskFn: unknown) => unknown;
  };

  return {
    framework,
    signal: typedHooks.signal,
    computed: typedHooks.computed,
    task: (taskFn) => {
      if (framework === "qwik") {
        typedHooks.task(taskFn);
        return undefined;
      }

      return typedHooks.task(taskFn) as TaskCleanup | undefined;
    }
  };
}
