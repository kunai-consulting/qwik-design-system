import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Switch } from "@kunai-consulting/qwik";
import styles from "./switch-custom.css?inline";

export default component$(() => {
  useStyles$(styles);
  const hasError = useSignal(false);

  const handleSubmit$ = $((e: SubmitEvent) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity()) {
      hasError.value = true;
    } else {
      hasError.value = false;
      console.log("Form submitted successfully!!!!!");
    }
  });

  return (
    <form
      preventdefault:submit
      noValidate
      onSubmit$={handleSubmit$}
      class="flex flex-col"
    >
      <Switch.Root
        required
        hasError={hasError.value}
        name="notifications"
        value="enabled"
        class="flex-col"
        onChange$={() => {
          hasError.value = false;
        }}
      >
        <div class="flex gap-2">
          <Switch.Trigger class="switch-trigger">
            <Switch.Thumb class="switch-thumb" />
          </Switch.Trigger>
          <Switch.Label>Enable notifications</Switch.Label>
          <Switch.HiddenInput />
        </div>

        {hasError.value && (
          <Switch.Error class="switch-error-message">
            This field is required
          </Switch.Error>
        )}
      </Switch.Root>

      <button type="submit" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
        Save preferences
      </button>
    </form>
  );
});
