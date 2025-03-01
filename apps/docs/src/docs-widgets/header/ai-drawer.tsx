import { component$ } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";

export const AIDrawer = component$(() => {
  return (
    <Modal.Root class="group">
      <Modal.Trigger>AI</Modal.Trigger>
      <Modal.Panel class="ml-auto data-open:translate-x-0 translate-x-[100%] transition-all duration-300 h-full w-[300px] backdrop:backdrop-blur-sm data-open:backdrop:backdrop-brightness-50 data-open:backdrop:animate-fade-in data-closing:backdrop:animate-fade-out">
        CONTENT
      </Modal.Panel>
    </Modal.Root>
  );
});
