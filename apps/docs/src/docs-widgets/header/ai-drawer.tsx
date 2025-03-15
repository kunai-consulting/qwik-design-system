import { Slot, component$ } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
import { AIButton } from "../docs-ai/ai-button";
import { Sparkles } from "../sparkles/sparkles";

export const AIDrawer = component$(() => {
  return (
    <Modal.Root class="group">
      <Modal.Trigger
        class="flex items-center justify-center cursor-pointer"
        data-footer-trigger
      >
        <Slot />
      </Modal.Trigger>
      <Modal.Panel class=" ml-auto data-open:translate-x-0 translate-x-[100%] duration-300 h-full w-[300px] data-open:backdrop:backdrop-brightness-20 data-open:backdrop:animate-fade-in data-closing:backdrop:animate-fade-out  border-l border-neutral-800 bg-neutral-accent data-open:flex flex-col gap-4 px-4 pt-4">
        <p class="text-neutral-foreground">
          Code-Notate is currently disabled. Once the Code-Notate package is released,
          this drawer will be updated to include the Code-Notate documentation.
        </p>

        <p class="text-neutral-foreground">
          Welcome to <Sparkles>Code-Notate!</Sparkles> I'm here to help you create awesome
          documentation.
        </p>
        <AIButton>Generate API</AIButton>
        <AIButton>Generate Docs</AIButton>
      </Modal.Panel>
    </Modal.Root>
  );
});
