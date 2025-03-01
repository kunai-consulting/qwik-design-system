import { component$ } from "@builder.io/qwik";
import { Modal } from "@qwik-ui/headless";
import { APIReference } from "../docs-ai/api";
import { DocsAI } from "../docs-ai/docs";
import { Sparkles } from "../sparkles/sparkles";

export const AIDrawer = component$(() => {
  return (
    <Modal.Root class="group">
      <Modal.Trigger>AI</Modal.Trigger>
      <Modal.Panel class="ml-auto data-open:translate-x-0 translate-x-[100%] duration-300 h-full w-[300px] data-open:backdrop:backdrop-brightness-20 data-open:backdrop:animate-fade-in data-closing:backdrop:animate-fade-out  border-l border-neutral-800 bg-neutral-accent flex flex-col gap-4 px-4 pt-4">
        <p class="text-neutral-foreground">
          Welcome to <Sparkles>Auto API!</Sparkles> I'm here to help you create awesome
          documentation.
        </p>
        <APIReference />
        <DocsAI />
      </Modal.Panel>
    </Modal.Root>
  );
});
