import { component$ } from "@builder.io/qwik";
import { Toaster } from "@kunai-consulting/qwik";

export default component$(() => {
  return (
    <Toaster.Root defaultDuration={5000} pauseOnHover>
      
      {/* Example of toast triggers with different types */}
      <div class="flex gap-2">
        <Toaster.Trigger
          toastType="success"
          title="Success!"
          description="Your action has been completed successfully."
        >
          Show Success Toast
        </Toaster.Trigger>
        
        <Toaster.Trigger
          toastType="error"
          title="Error!"
          description="There was a problem with your action."
          duration={10000}
        >
          Show Error Toast
        </Toaster.Trigger>
        
        <Toaster.Trigger
          toastType="info"
          title="Information"
          description="Here's some helpful information for you."
        >
          Show Info Toast
        </Toaster.Trigger>
        
        <Toaster.Trigger
          toastType="warning"
          title="Warning"
          description="Please be aware of this important warning."
        >
          Show Warning Toast
        </Toaster.Trigger>
      </div>
      
      {/* Example of programmatic toast creation using useContext and toastContextId */}
      {/*
        import { useContext } from "@builder.io/qwik";
        import { toastContextId } from "./toast-context";

        // Then inside your component:
        const context = useContext(toastContextId);
        
        // Add a toast programmatically
        context.add$({
          type: "success",
          title: "Programmatic Toast",
          description: "This toast was added programmatically",
          duration: 3000,
          dismissible: true
        });
      */}
    </Toaster.Root>
  );
}); 