import { Modal } from "@qwik-ui/headless";
import { $, Slot, component$, useSignal } from "@qwik.dev/core";
import { useLocation } from "@qwik.dev/router";
import { AIButton } from "../docs-ai/ai-button";
import { Sparkles } from "../sparkles/sparkles";
import { Spinner } from "../spinner/spinner";
import { runCommand } from "./run-command";

export const AIDrawer = component$(() => {
  const location = useLocation();
  const route = location.url.pathname
    .split("/")
    .filter((segment) => segment.length > 0)
    .pop();
  const path = `../../libs/components/src/${route}`;
  const isGeneratingApiSig = useSignal(false);
  const isGeneratingDocsSig = useSignal(false);

  const handleGenerateApiClick = $(async () => {
    isGeneratingApiSig.value = true;
    const result = await runCommand(`pnpm run cn gen-api ${path}`);
    if (result.success) {
      console.log("API generated successfully!");
      console.log(result.output);
    } else {
      console.error("API generation failed");
    }
    isGeneratingApiSig.value = false;
  });

  const handleGenerateDocsClick = $(async () => {
    isGeneratingDocsSig.value = true;
    const result = await runCommand(`pnpm run cn gen-docs ${path}`);
    if (result.success) {
      console.log("Docs generated successfully!");
      console.log(result.output);
    } else {
      console.error(result.error);
    }
    isGeneratingDocsSig.value = false;
  });

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
          Welcome to <Sparkles>CodeNotate!</Sparkles> I'm here to help you create awesome
          documentation.
        </p>

        {(!isGeneratingApiSig.value && (
          <AIButton
            onClick$={handleGenerateApiClick}
            disabled={isGeneratingDocsSig.value}
          >
            Generate API
          </AIButton>
        )) || (
          <div class="flex items-center justify-center gap-4 text-neutral-foreground py-2">
            <Spinner />
            <div>Generating API...</div>
          </div>
        )}
        {(!isGeneratingDocsSig.value && (
          <AIButton
            onClick$={handleGenerateDocsClick}
            disabled={isGeneratingApiSig.value}
          >
            Generate Docs
          </AIButton>
        )) || (
          <div class="flex items-center justify-center gap-4 text-neutral-foreground py-2">
            <Spinner />
            <div>Generating Docs...</div>
          </div>
        )}
      </Modal.Panel>
    </Modal.Root>
  );
});
