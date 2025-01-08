import { $, component$, useContext, type PropsOf } from '@builder.io/qwik';
import { VisuallyHidden } from '../visually-hidden/visually-hidden';
import { radioGroupContextId } from './radio-group-context';

type RadioGroupHiddenNativeInputProps = PropsOf<'input'>;

export const RadioGroupHiddenNativeInput = component$(
  (props: RadioGroupHiddenNativeInputProps) => {
    const context = useContext(radioGroupContextId);

    const handleChange$ = $((e: InputEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.checked === context.isCheckedSig.value) {
        return;
      }

      context.isCheckedSig.value = target.checked;
    });

    return (
      <VisuallyHidden>
        <input
          type="radio"
          tabIndex={-1}
          checked={context.isCheckedSig.value === true}
          data-qds-checkbox-hidden-input
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
