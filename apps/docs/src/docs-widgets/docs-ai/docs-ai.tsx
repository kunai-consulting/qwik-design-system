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

      // Read component files
      const files = fs
        .readdirSync(componentPath)
        .filter((file) => file.endsWith(".tsx") || file.endsWith(".ts"));

      const fileContents = files.map((file) => ({
        name: file,
        content: fs.readFileSync(resolve(componentPath, file), "utf-8")
      }));

      const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY
      });

      const response = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 8192,
        messages: [
          {
            role: "user",
            content: `Analyze these files and output ONLY JSDoc comments that should be added.

CRITICAL:
- DO NOT output any code blocks
- DO NOT output any explanations
- ONLY output the exact comment and its location

Add JSDoc comments for:
1. Components, which is anything with a component$ call
2. Properties within types/interfaces (add comment above each property)

Output format must be EXACTLY:
FILE: filename.tsx
LINE: [exact line to add above]
/** Your JSDoc comment */

Example of correct output:
FILE: popover-trigger.tsx
LINE: export const PopoverTrigger = component$
/** A button that opens the popover panel */

LINE: disabled
/** The button cannot be interacted with when this is enabled */

Additional info:

Any API with bind:x is a reactive value, which allows consumers to pass in their own signal and change that specific property.

For example, bind:value, allows them to change the main state. With a select component, that might be the selected value.

if there is the same api without the bind:x, just x, then it is an initial value that they get on page load. For example, the selected item might be "Apple" on page load.

Anything with on and $ in the name is a handler, which allows consumers to pass in their own function and run code when a specific event happens.

Anything with a $ is also a QRL, a lazy loadable resource, this is good to know, but consumers of this library don't need to know this. keep it simple.

Do NOT write to any file that includes the following words in the filename:
- context
- test
- driver
- index

Here are the files to process:
${fileContents
  .map(
    (file) => `
--- ${file.name} ---
${file.content}`
  )
  .join("\n")}`
          }
        ]
      });

      if (response.content[0].type === "text") {
        const content = response.content[0].text;
        console.log("AI Response:", content);

        const commentBlocks = content.split("\nFILE: ").slice(1);
        let diffReport = "";

        for (const block of commentBlocks) {
          const [filename, ...lines] = block.split("\n");
          diffReport += `\n## ${filename.trim()}\n\n`;

          const filePath = resolve(componentPath, filename.trim());
          const fileContent = fs.readFileSync(filePath, "utf-8").split("\n");

          let currentLine = "";
          let pendingComment = [];

          for (const line of lines) {
            if (line.startsWith("LINE: ")) {
              // if pending comment, insert it at the previous location
              if (pendingComment.length > 0) {
                const targetLineIndex = fileContent.findIndex((l) =>
                  l.includes(currentLine)
                );
                if (targetLineIndex !== -1) {
                  fileContent.splice(targetLineIndex, 0, ...pendingComment);
                  diffReport += `\nAdded comment at line ${targetLineIndex + 1}\n`;
                }
                pendingComment = [];
              }
              currentLine = line.replace("LINE: ", "").trim();
            } else if (line.trim()) {
              pendingComment.push(line.trim());
            }
          }

          // any remaining comment handling
          if (pendingComment.length > 0 && currentLine) {
            const targetLineIndex = fileContent.findIndex((l) => l.includes(currentLine));
            if (targetLineIndex !== -1) {
              fileContent.splice(targetLineIndex, 0, ...pendingComment);
              diffReport += `\nAdded comment at line ${targetLineIndex + 1}\n`;
            }
          }

          // Write the updated content back to the file
          fs.writeFileSync(filePath, fileContent.join("\n"), "utf-8");
        }

        console.log("Generated diff report:", diffReport);
        return diffReport;
      }
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
