import { component$ } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Toaster.Root defaultDuration={5000} pauseOnHover>
      {/* Add the Toaster component to actually display toasts */}
      <Toaster.View />
      
      {/* Example of toast triggers with different types */}
      <div class="flex gap-2">
        <Toaster.Trigger
          toastType="success"
          title="Success!"
          description="Your action has been completed successfully."
        >
          Show Success Toast
        </Toaster.Trigger>
        
        {/* Other trigger buttons */}
      </div>
    </Toaster.Root>
  );
}); 