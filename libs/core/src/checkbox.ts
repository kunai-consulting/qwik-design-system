import type { ReactivityAdapter } from "./adapter";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function useCheckbox(props: CheckboxProps, runtime: ReactivityAdapter) {
  const r = runtime;

  const checkedSignal = r.signal(props.checked);

  const isIndeterminate = r.computed(() => {
    return checkedSignal.value === null;
  });

  r.task(({ track, cleanup }) => {
    track(() => checkedSignal.value);

    const checked = checkedSignal.value;
    props.onChange(checked);

    cleanup(() => {
      // Any cleanup logic here
    });
  });

  return {
    checked: checkedSignal,
    isIndeterminate
  };
}
