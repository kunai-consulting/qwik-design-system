type TaskCleanup = () => void;
type TrackingContext = {
    track: <T>(fn: () => T) => T;
    cleanup: (cleanupFn: TaskCleanup) => void;
};
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
    task: (taskFn: ExplicitTrackingTask) => TaskCleanup | undefined;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
    framework: "qwik" | "react";
};
export declare function useRuntime(runtime: ReactivityAdapter): ReactivityAdapter;
/**
 * This is "auto-tracking". For example, in useComputed(() => mySig.value). Whenever mySig's value is changed the computed will re-run.
 *
 * This happens for both computeds, and preact's regular effects.
 */
export declare function createReactivityAdapter(framework: "qwik", hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (taskFn: ExplicitTrackingTask) => void;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
}): ReactivityAdapter;
export declare function createReactivityAdapter(framework: "react", hooks: {
    signal: <T>(initialValue: T) => Signal<T>;
    computed: <T>(computeFn: () => T) => Computed<T>;
    task: (cb: () => (() => void) | undefined) => void;
    fn: <T extends (...args: unknown[]) => unknown>(fn: T) => T;
}): ReactivityAdapter;
/**
 * Takes a Qwik-style explicit tracking task and converts it to React signals implicit tracking effect.
 */
export declare function convertToReactEffect(qwikTask: ExplicitTrackingTask, reactEffect: (fn: ImplicitTrackingTask) => TaskCleanup | undefined): TaskCleanup | undefined;
export {};
