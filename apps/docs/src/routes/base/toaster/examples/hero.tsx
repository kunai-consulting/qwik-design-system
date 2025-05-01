import { component$, useStyles$ } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";
import styles from "./toaster-custom.css?inline";

export default component$(() => {
  useStyles$(styles);

  return (
    <Toaster.Root defaultDuration={5000} pauseOnHover>
      <Toaster.View />

      <div class="flex flex-wrap gap-2">
        <Toaster.Trigger
          toastType="success"
          title="Success!"
          description="Your action has been completed successfully."
          class="success"
        >
          Success Toast
        </Toaster.Trigger>

        <Toaster.Trigger
          toastType="error"
          title="Error!"
          description="There was a problem with your action."
          class="error"
        >
          Error Toast
        </Toaster.Trigger>

        <Toaster.Trigger
          toastType="info"
          title="Information"
          description="Here's some helpful information for you."
          class="info"
        >
          Info Toast
        </Toaster.Trigger>

        <Toaster.Trigger
          toastType="warning"
          title="Warning"
          description="Please be aware of this important warning."
          class="warning"
        >
          Warning Toast
        </Toaster.Trigger>
      </div>
    </Toaster.Root>
  );
});
