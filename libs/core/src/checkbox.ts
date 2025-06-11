import type { ReactivityAdapter } from "./adapter";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function useCheckbox(props: CheckboxProps, reactivity: ReactivityAdapter) {
  const checkedSignal = reactivity.signal(props.checked);

  const isIndeterminate = reactivity.computed(() => {
    return checkedSignal.value === null;
  });

  // Handle both manual and auto-tracking tasks
  if (reactivity.framework === "qwik") {
    // Qwik manual tracking style
    reactivity.task(({ track, cleanup }) => {
      track(() => checkedSignal.value);

      const checked = checkedSignal.value;
      props.onChange(checked);

      cleanup(() => {
        // Any cleanup logic
      });
    });
  } else {
    // React auto-tracking style
    reactivity.task(() => {
      const checked = checkedSignal.value;
      props.onChange(checked);
      return undefined; // No cleanup needed
    });
  }

  return {
    checked: checkedSignal,
    isIndeterminate
  };
}
