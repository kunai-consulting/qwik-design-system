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
FILE: types.tsx
LINE: type PublicButtonProps
/** Configuration options for the Button component */

LINE: disabled
/** The button cannot be interacted with when this is enabled */

Additional info:

Any API with bind:x is a reactive value, which allows consumers to pass in their own signal and change that specific property.

For example, bind:value, allows them to change the main state. With a select component, that might be the selected value.

if there is the same api without the bind:x, just x, then it is an initial value that they get on page load. For example, the selected item might be "Apple" on page load.

Anything with on and $ in the name is a handler, which allows consumers to pass in their own function and run code when a specific event happens.

Anything with a $ is also a QRL, a lazy loadable resource, this is good to know, but consumers of this library don't need to know this. keep it simple.

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
        console.log("Comment blocks found:", commentBlocks.length);

        // Process the AI response and insert comments
        for (const block of commentBlocks) {
          const [filename, ...lines] = block.split("\n");
          console.log("Processing file:", filename.trim());
          const filePath = resolve(componentPath, filename.trim());
          const fileContent = fs.readFileSync(filePath, "utf-8").split("\n");

          // Process each comment in the block
          let currentLine = "";
          let comment = "";
          let modified = false;

          for (const line of lines) {
            console.log("Processing line:", line);
            if (line.startsWith("LINE: ")) {
              currentLine = line.replace("LINE: ", "").trim();
              console.log("Found target line:", currentLine);
            } else if (line.trim() === "/**" || line.trim().startsWith("/** ")) {
              comment = line.trim();
              console.log("Found comment:", comment);
              // Find the line number where this declaration exists
              const targetLineIndex = fileContent.findIndex((l) =>
                l.includes(currentLine)
              );
              console.log("Target line index:", targetLineIndex);
              if (targetLineIndex !== -1) {
                // Insert comment above the target line
                fileContent.splice(targetLineIndex, 0, comment);
                modified = true;
                console.log("Inserted comment at line", targetLineIndex);
              }
            }
          }

          if (modified) {
            fs.writeFileSync(filePath, fileContent.join("\n"));
            console.log(`✅ Updated ${filename}`);
          } else {
            console.log(`No changes made to ${filename}`);
          }
        }
      } else {
        console.log("No text content in response");
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
