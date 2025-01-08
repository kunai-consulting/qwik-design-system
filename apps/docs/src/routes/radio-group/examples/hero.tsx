import { component$, useStyles$ } from '@builder.io/qwik';
import { RadioGroup } from '@kunai-consulting/qwik-components';

export default component$(() => {
  useStyles$(styles);

  return (
    <RadioGroup.Root>
      <RadioGroup.Trigger class="radio-group-trigger">
        <RadioGroup.Indicator class="radio-group-indicator">
          <LuCheck />
        </RadioGroup.Indicator>
      </RadioGroup.Trigger>
    </RadioGroup.Root>
  );
});

// example styles
import styles from './radio-group.css?inline';
import { LuCheck } from '@qwikest/icons/lucide';
