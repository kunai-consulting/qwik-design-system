import { component$ } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";

export const AIDrawer = component$(() => {
  return (
    <Modal.Root class="group">
      <Modal.Trigger>AI</Modal.Trigger>
      <Modal.Panel
        class="inset-y-0 right-0 ml-auto h-full max-w-sm rounded-l-base border-l data-closing:slide-out-to-right data-open:slide-in-from-right fixed w-full bg-background p-6 text-foreground transition-all backdrop:brightness-50 backdrop:backdrop-blur-sm
          data-closing:duration-300 data-open:duration-300 data-open:animate-in data-closing:animate-out
          backdrop:data-closing:duration-300 backdrop:data-open:duration-300 backdrop:data-open:animate-in backdrop:data-closing:animate-out backdrop:data-closing:fade-out backdrop:data-open:fade-in"
      >
        CONTENT
      </Modal.Panel>
    </Modal.Root>
  );
});
