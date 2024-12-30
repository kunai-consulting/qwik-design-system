import { component$, type PropsOf, Slot, $, useSignal } from "@builder.io/qwik";
import { Anthropic } from "@anthropic-ai/sdk";
import { server$, useLocation } from "@builder.io/qwik-city";
import * as fs from "node:fs";
import { resolve } from "node:path";

interface CommentBlock {
  filename: string;
  comments: Array<{
    targetLine: string;
    comment: string[];
  }>;
}

export const DocsAI = component$(() => {
  const loc = useLocation();
  const isGenerating = useSignal(false);
  const status = useSignal('');

  const generateAPI = server$(async function() {
    try {
      const route = loc.url.pathname.split("/").filter(Boolean)[0];
      const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);
      
      const updates = [];
      updates.push('Reading files...');
      const files = fs
        .readdirSync(componentPath)
        .filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));
      const fileContents = files.map((file) => ({
        name: file,
        content: fs.readFileSync(resolve(componentPath, file), "utf-8")
      }));

      updates.push('Analyzing with Claude...');
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        messages: [
          {
            role: "user",
            content: `You are a JSON-only API. Your response must be PURE JSON with no other text.

            Required output format:
            [{
              "filename": "component.tsx",
              "comments": [{
                "targetLine": "export const Button = component$",
                "comment": ["/** A button component */"]
              }]
            }]

            Rules for generating JSDoc comments:
            1. Components (anything with component$ call)
            2. Properties within types/interfaces (add comment above each property)

            Documentation rules:
            - bind:x properties = "Reactive value that can be controlled via signal. Describe what passing their signal does for this bind property"
            - if a property is x, with bind: removed, it is an initial value to set when the page loads
            - regular properties = describe what the property does
            - on$ properties = "Event handler for [event] events"
            - Never mention QRL or implementation details

            Ignore files named: context, test, driver, index

            Files to analyze:
            ${fileContents.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
          }
        ]
      });

      if (response.content[0].type === "text") {
        updates.push('Adding comments...');
        const commentBlocks: CommentBlock[] = JSON.parse(response.content[0].text);
        let diffReport = "";

        for (const block of commentBlocks) {
          const filePath = resolve(componentPath, block.filename);
          const fileContent = fs.readFileSync(filePath, "utf-8").split("\n");

          for (const { targetLine, comment } of block.comments) {
            const lineIndex = fileContent.findIndex((l) => l.includes(targetLine));
            if (lineIndex !== -1) {
              fileContent.splice(lineIndex, 0, ...comment);
              diffReport += `\nAdded comment to ${block.filename} at line ${lineIndex + 1}\n`;
            }
          }

          fs.writeFileSync(filePath, fileContent.join("\n"), "utf-8");
        }

        return diffReport;
      }
      
      return updates;
    } catch (error) {
      console.error("Error generating API docs:", error);
      return ['Error occurred'];
    }
  });

  return (
    <div class="flex gap-2">
      <AIButton 
        onClick$={async () => {
          isGenerating.value = true;
          status.value = 'Generating...';
          try {
            const updates = await generateAPI();
            for (const update of updates) {
              status.value = update;
              await new Promise(r => setTimeout(r, 100));
            }
          } finally {
            isGenerating.value = false;
            status.value = '';
          }
        }} 
        disabled={isGenerating.value}
      >
        {isGenerating.value ? status.value : "Generate API"}
      </AIButton>
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
