import { component$, type PropsOf, Slot, $, useSignal } from "@builder.io/qwik";
import { Anthropic } from "@anthropic-ai/sdk";
import { server$, useLocation } from "@builder.io/qwik-city";
import * as fs from "node:fs";
import { resolve } from "node:path";

export const DocsAI = component$(() => {
  const loc = useLocation();
  const isGenerating = useSignal(false);

  const generateAPI = server$(async () => {
    if (isGenerating.value) return;
    isGenerating.value = true;

    try {
      const route = loc.url.pathname.split("/").filter(Boolean)[0];
      const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);

      console.log(componentPath);

      //   // 2. Read component files
      //   const files = fs
      //     .readdirSync(componentPath)
      //     .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

      //   const anthropic = new Anthropic({
      //     apiKey: process.env.ANTHROPIC_API_KEY
      //   });

      //   // 3. Process each file
      //   for (const file of files) {
      //     const filePath = resolve(componentPath, file);
      //     const content = fs.readFileSync(filePath, "utf-8");

      //     // 4. Generate documentation with Claude
      //     const response = await anthropic.messages.create({
      //       model: "claude-3-sonnet-20240229",
      //       max_tokens: 4000,
      //       messages: [
      //         {
      //           role: "user",
      //           content: `You are a technical documentation expert. Please:
      //         1. Add detailed JSDoc comments to any types/interfaces/components
      //         2. Add 'Public' prefix to exposed types that don't have _ or 'internal' in their name or property names
      //         3. Add references to where types are used in components if the Public prefix is used
      //         4. DO NOT modify any functionality

      //         Here's the TypeScript code:
      //         ${content}`
      //         }
      //       ]
      //     });

      //     // 5. Write updated content back
      //     const updatedContent =
      //       response.content[0].type === "text" ? response.content[0].text : "";
      //     if (!updatedContent) {
      //       throw new Error("No content received from Claude");
      //     }
      //     fs.writeFileSync(filePath, updatedContent);
      //   }
    } catch (error) {
      console.error("Error generating API docs:", error);
    } finally {
      isGenerating.value = false;
    }
  });

  return (
    <div class="flex gap-2">
      <AIButton onClick$={() => generateAPI()} disabled={isGenerating.value}>
        {isGenerating.value ? "Generating..." : "Generate API"}
      </AIButton>
      <AIButton>Generate Anatomy</AIButton>
      <AIButton>Generate Docs</AIButton>
    </div>
  );
});

export const AIButton = component$((props: PropsOf<"button">) => {
  return (
    <button
      class="bg-qwik-purple-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
      type="button"
      {...props}
    >
      <Slot />
    </button>
  );
});
