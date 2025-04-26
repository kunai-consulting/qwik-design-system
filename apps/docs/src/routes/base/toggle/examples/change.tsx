import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Toggle } from "@kunai-consulting/qwik";
import { LuThumbsUp } from "@qwikest/icons/lucide";
import styles from "./toggle.css?inline";

export default component$(() => {
  useStyles$(styles);
  const countSig = useSignal(0);

  const handleChange = $(() => {
    countSig.value++;
  });

  return (
    <div>
      <Toggle.Root class="toggle-root" aria-label="Toggle Like" onChange$={handleChange}>
        <LuThumbsUp />
      </Toggle.Root>
      <p>Count: {countSig.value}</p>
    </div>
  );
});
