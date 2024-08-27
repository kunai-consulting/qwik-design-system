import { component$, useContext, type PropsOf, Slot } from '@builder.io/qwik';
import { CheckboxContext } from './context-id';

export type CheckboxIndicatorProps = PropsOf<'div'>;

export const CheckboxIndicator = component$<CheckboxIndicatorProps>((props) => {
  const checkSig = useContext(CheckboxContext);
  // I need the below because tailwind isn't working here
  const hidden = checkSig.value === false;

  return (
    <div {...props}>
      {/* {checkSig.value && ( */}
      <div hidden={hidden} aria-hidden={!checkSig.value}>
        <Slot />
      </div>
      {/* )} */}
    </div>
  );
});
