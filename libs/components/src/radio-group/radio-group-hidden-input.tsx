import { $, component$, useContext, type PropsOf } from '@builder.io/qwik';
import { VisuallyHidden } from '../visually-hidden/visually-hidden';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupHiddenNativeInputProps = PropsOf<'input'> & {
  _index?: number | null;
};

export const RadioGroupHiddenNativeInput = component$(
  (props: RadioGroupHiddenNativeInputProps) => {
    const context = useContext(radioGroupContextId);
    const _index = props._index;

    const handleChange$ = $(() => {
      context.selectedIndexSig.value = _index ?? null;
    });

    return (
      <VisuallyHidden>
        <input
          type="radio"
          tabIndex={-1}
          checked={context.selectedIndexSig.value === _index}
          data-qds-radio-group-hidden-input
          name={context.name ?? props.name ?? undefined}
          required={context.required ?? props.required ?? undefined}
          value={context.value ?? props.value ?? undefined}
          onChange$={[handleChange$, props.onChange$]}
          {...props}
        />
      </VisuallyHidden>
    );
  }
);
