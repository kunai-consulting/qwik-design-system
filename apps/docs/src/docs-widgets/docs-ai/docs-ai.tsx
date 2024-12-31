import { component$, type PropsOf, Slot, $, useSignal } from "@builder.io/qwik";
import { Anthropic } from "@anthropic-ai/sdk";
import { server$, useLocation } from "@builder.io/qwik-city";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { execSync } from "node:child_process";
import { transformPublicTypes, getSourceFile } from "../../../auto-api/utils";

const generateComponentDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a JSON-only API. Your response must be PURE JSON with no other text.
        Required output format: [{ "filename": "component.tsx", "comments": [{ "targetLine": "export const Button = component$", "comment": ["/** A button component */"] }] }]

        IMPORTANT: Return a direct array, not an object with a 'files' property.
        
        Only analyze component definitions (anything with component$ call). Example:
        // The button that opens the popover panel when clicked
        export const PopoverTrigger = component$((props: PropsOf<"button">) => {
          return <button onClick$={...} {...props} />;
        });

        Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
        }
      ]
    });
    const parsed =
      response.content[0].type === "text" ? JSON.parse(response.content[0].text) : [];
    // If we get an object with files property, return that array, otherwise return the direct array
    return parsed.files || parsed;
  }
);

const generateTypeDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a JSON-only API. Your response must be PURE JSON with no other text.
        Required output format: [{ "filename": "component.tsx", "comments": [{ "targetLine": "gap?: number;", "comment": ["/** The gap between slides */"] }] }]
        
        IMPORTANT: Return a direct array, not an object with a 'files' property.
        
        Only analyze properties within types/interfaces. Example:
        export type PublicCarouselRootProps = PropsOf<'div'> & {
          /** The gap between slides */
          gap?: number;
        };

        Documentation rules:
        - bind:x properties = "Reactive value that can be controlled via signal. Describe what passing their signal does for this bind property"
        - if a property is x, with bind: removed, it is an initial value to set when the page loads
        - regular properties = describe what the property does
        - on$ properties = "Event handler for [event] events"

        Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
        }
      ]
    });
    const parsed =
      response.content[0].type === "text" ? JSON.parse(response.content[0].text) : [];
    // If we get an object with files property, return that array, otherwise return the direct array
    return parsed.files || parsed;
  }
);

const generateDataAttributeDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a JSON-only API. Your response must be PURE JSON with no other text.
        Required output format: [{ "filename": "component.tsx", "comments": [{ "targetLine": "data-qui-carousel-scroller", "comment": ["// The identifier for the container that enables scrolling and dragging in a carousel"] }] }]
        
        IMPORTANT: 
        - Return a direct array, not an object with a 'files' property
        - Each data-* attribute must have its own comment
        - Comment should be placed directly above the line containing the data attribute
        
        Only analyze data attributes (format: "data-*"). Example:
        return <div {...props}
          // Indicates whether the element is currently disabled
          data-disabled={isDisabled ? '' : undefined}
          // Indicates whether the element is currently checked
          data-checked={isChecked ? '' : undefined}
          // Indicates whether the element is in an indeterminate state
          data-mixed={isMixed ? '' : undefined} />;

        Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
        }
      ]
    });
    const parsed =
      response.content[0].type === "text" ? JSON.parse(response.content[0].text) : [];
    return parsed.files || parsed;
  }
);

const analyzeTypesForPublic = server$(
  async (files: Array<{ name: string; content: string }>) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a JSON-only API. Your response must be PURE JSON with no other text.
        Required output format: [{ "filename": "component.tsx", "comments": [{ "targetLine": "export type ButtonProps", "shouldBePublic": true, "reason": "Contains only public properties and is used for component props" }] }]
        
        IMPORTANT: 
        - Return a direct array, not an object with a 'files' property
        - IGNORE any types that already start with "Public" prefix
        - Only analyze types that don't already have the Public prefix
        
        Analyze exported types/interfaces and determine if they should be public based on:
        1. No properties with underscore prefix (_) or marked as @internal
        2. Properties appear to be intended for public consumption
        3. Type is used for component props or public API
        
        Example of public type:
        export type ButtonProps = {
          variant?: 'primary' | 'secondary';
          size?: 'small' | 'medium' | 'large';
        };

        Example of internal type:
        export type ButtonState = {
          _isPressed: boolean;
          _internalId: string;
        };

        Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
        }
      ]
    });
    const parsed =
      response.content[0].type === "text" ? JSON.parse(response.content[0].text) : [];
    return parsed.files || parsed;
  }
);

const generateKeyboardDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      messages: [
        {
          role: "user",
          content: `You are a JSON-only API. Your response must be PURE JSON with no other text.
          Required output format: [
            { "key": "Enter", "comment": "When focus is on the input, selects the focused item" },
            { "key": "Space", "comment": "When focus is on the input, selects the focused item" },
            { "key": "ArrowDown", "comment": "When the combobox is closed, opens the combobox. When the combobox is open, moves focus to the next item" },
            { "key": "ArrowUp", "comment": "When the combobox is closed, opens the combobox. When the combobox is open, moves focus to the previous item" },
            { "key": "Home", "comment": "When the combobox is open, moves focus to the first item" },
            { "key": "End", "comment": "When the combobox is open, moves focus to the last item" },
            { "key": "Escape", "comment": "Closes the combobox" },
            { "key": "Tab", "comment": "When the combobox is open, closes the combobox" },
            { "key": "Any", "comment": "When the combobox is open and focus is on the input, types the character into the input" }
          ]

          Analyze the component files and provide keyboard interaction documentation.
          Be specific about which part of the component is being interacted with.
          
          Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`
        }
      ]
    });

    return response.content[0].type === "text"
      ? JSON.parse(response.content[0].text)
      : [];
  }
);

export const DocsAI = component$(() => {
  const loc = useLocation();
  const isGenerating = useSignal(false);
  const status = useSignal("");

  const generateAPI = server$(async () => {
    try {
      const route = loc.url.pathname.split("/").filter(Boolean)[0];
      const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);

      const updates = [];
      updates.push("Reading files...");
      const files = fs
        .readdirSync(componentPath)
        .filter(
          (f) =>
            (f.endsWith(".tsx") || f.endsWith(".ts")) &&
            !["context", "test", "driver", "index"].some((ignore) => f.includes(ignore))
        );
      const fileContents = files.map((file) => ({
        name: file,
        content: fs.readFileSync(resolve(componentPath, file), "utf-8")
      }));

      updates.push("Analyzing with Claude...");
      const [
        componentComments,
        typeComments,
        dataAttributeComments,
        publicTypeAnalysis,
        keyboardDocs
      ] = await Promise.all([
        generateComponentDocs(fileContents),
        generateTypeDocs(fileContents),
        generateDataAttributeDocs(fileContents),
        analyzeTypesForPublic(fileContents),
        generateKeyboardDocs(fileContents)
      ]);

      console.log("componentComments", componentComments);
      console.log("typeComments", typeComments);
      console.log("dataAttributeComments", dataAttributeComments);
      console.log("keyboardDocs", keyboardDocs);

      // Split the updates into two parts

      // 1. Handle type transformations and comments
      updates.push("Adding comments and transforming types...");
      const allComments = [
        ...componentComments,
        ...typeComments,
        ...dataAttributeComments
      ];
      let diffReport = "";

      // Handle comments
      for (const block of allComments) {
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

      // Handle public type transformations
      for (const block of publicTypeAnalysis) {
        const filePath = resolve(componentPath, block.filename);
        const sourceFile = getSourceFile(filePath);
        const transformedCode = transformPublicTypes(sourceFile, block.comments);
        fs.writeFileSync(filePath, transformedCode, "utf-8");
        diffReport += `\nTransformed types in ${block.filename}\n`;
      }

      // 2. Handle keyboard interactions separately
      updates.push("Updating API with keyboard interactions...");
      const apiPath = resolve(
        process.cwd(),
        `apps/docs/src/routes/${route}/auto-api/api.ts`
      );

      const apiContent = fs.readFileSync(apiPath, "utf-8");
      const apiMatch = apiContent.match(/export const api = ({[\s\S]*});/);
      if (apiMatch) {
        const api = JSON.parse(apiMatch[1]);
        // Only update keyboard interactions, don't touch types
        api.keyboardInteractions = keyboardDocs;
        fs.writeFileSync(
          apiPath,
          `export const api = ${JSON.stringify(api, null, 2)};`,
          "utf-8"
        );
      }

      // Format all modified files from project root
      updates.push("Formatting files...");
      execSync("pnpm format", {
        cwd: resolve(process.cwd(), "../..") // Go up to project root where package.json is
      });

      return diffReport ? [diffReport] : updates;
    } catch (error) {
      console.error("Error generating API docs:", error);
      return ["Error occurred"];
    }
  });

  return (
    <div class="flex gap-2">
      <AIButton
        onClick$={async () => {
          isGenerating.value = true;
          status.value = "Generating...";
          try {
            await generateAPI();
          } finally {
            isGenerating.value = false;
            status.value = "";
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
