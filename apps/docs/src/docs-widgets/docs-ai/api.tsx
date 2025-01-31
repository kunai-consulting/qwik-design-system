import { execSync } from "node:child_process";
import fs from "node:fs";
import { resolve } from "node:path";
import { Anthropic } from "@anthropic-ai/sdk";
import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { isDev } from "@builder.io/qwik/build";
import { getSourceFile, transformPublicTypes } from "../../../auto-api/utils";
import { AIButton } from "./ai-button";

const generateWithClaude = async (prompt: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });
  return response.content[0]?.type === "text" ? JSON.parse(response.content[0].text) : [];
};

const generateComponentDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
      Required output format: [{ "filename": "component.tsx", "comments": [{ "targetLine": "export const Button = component$", "comment": ["/** A button component */"] }] }]

      IMPORTANT: Return a direct array, not an object with a 'files' property.
      
      Only analyze component definitions (anything with component$ call). Example:
      // The button that opens the popover panel when clicked
      export const PopoverTrigger = component$((props: PropsOf<"button">) => {
        return <button onClick$={...} {...props} />;
      });

      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

const generateFeatureList = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
      Required output format: { "features": ["Feature 1", "Feature 2", ...] }

      Analyze the component implementation and return a list of features.
      
      Combobox example features:
      - "WAI ARIA Combobox design pattern"
      - "Single and multiple selection"
      - "Reactive and initial value changes"
      - "Disabled items"
      - "Tab key focus management"
      - "Grouped items"
      - "Looping"
      - "Custom scroll behavior"
      - "Popover UI above all"
      - "Custom positioning (Popover)"
      - "Typeahead item selection and focus"
      - "Arrow key navigation and focus management"
      - "Open/Close popover by typing, focus, or manually"
      - "Custom filter function"
      - "Closes on no matching items"

      Modal example features:
      - "WAI ARIA Dialog design pattern"
      - "Focus trap within modal"
      - "Return focus on close"
      - "Escape to close"
      - "Click outside to dismiss"
      - "Prevents background scrolling"
      - "Animated transitions"
      - "Custom positioning"
      - "Nested modal support"
      - "Accessible descriptions"
      - "Custom close triggers"
      - "Backdrop customization"
      - "Multiple modal stacking"
      - "Responsive sizing"
      - "Keyboard navigation"
      
      Rules:
      - Minimum 5 features
      - Focus on meaningful functionality that users care about
      - Exclude obvious implementation details
      - Don't list basic features that every component would have

      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

const generateTypeDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
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

      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

const generateDataAttributeDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
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

      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

const analyzeTypesForPublic = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
      Required output format: [{ 
        "filename": "component.tsx", 
        "comments": [{ 
          "targetLine": "export type ButtonProps", 
          "shouldBePublic": true, 
          "reason": "Used as component props type",
          "dependencies": ["ButtonState", "ButtonVariant"]
        }] 
      }]
      
      IMPORTANT: 
      - Return a direct array, not an object with a 'files' property
      - IGNORE any types that already start with "Public" prefix
      - Include ALL dependent types that should also be made public

      Specifically for Qwik components, a type MUST be made public if:
      1. It's used in component$<Type> definition
      2. It's a props interface/type that extends PropsOf
      3. It's used in exported component props
      4. It's used in PropFunction types for callbacks
      5. It's used across multiple components through imports
      6. It's part of the component's public event system
      
      Examples of types that MUST be public:
      - type Props = PropsOf<"div"> & { /* ... */ }
      - interface ComponentProps { /* ... */ }
      - export const Component = component$<Props>((props) => {})
      - onEvent$?: PropFunction<(param: EventType) => void>
      
      Types should stay private if:
      1. They're only used inside component implementation
      2. They're used for internal state management
      3. They're marked with @internal
      4. They're prefixed with underscore
      5. They're only used in event handlers or callbacks
      
      For each identified public type:
      1. Find all types it depends on or references
      2. Check if those types are used in public API
      3. Include both the main type and its public dependencies

      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

const generateKeyboardDocs = server$(
  async (files: Array<{ name: string; content: string }>) => {
    return generateWithClaude(`You are a JSON-only API. Your response must be PURE JSON with no other text.
      Required output format: [
        { "key": "Enter", "comment": "When focus is on the input, selects the focused item" }
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
      
      Files to analyze: ${files.map((f) => `\n--- ${f.name} ---\n${f.content}`).join("\n")}`);
  }
);

export const APIReference = component$(() => {
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
          (f: string) =>
            (f.endsWith(".tsx") || f.endsWith(".ts")) &&
            !["context", "test", "driver", "index"].some((ignore) => f.includes(ignore))
        );
      const fileContents = files.map((file: string) => ({
        name: file,
        content: fs.readFileSync(resolve(componentPath, file), "utf-8")
      }));

      updates.push("Analyzing with Claude...");
      // Get existing metadata if it exists
      const metadataPath = resolve(componentPath, "metadata.json");
      let existingMetadata = {};
      if (fs.existsSync(metadataPath)) {
        existingMetadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
      }

      // Analyze with Claude and merge with existing metadata
      const [
        componentComments,
        typeComments,
        dataAttributeComments,
        publicTypeAnalysis,
        keyboardDocs,
        featureList
      ] = await Promise.all([
        generateComponentDocs(fileContents),
        generateTypeDocs(fileContents),
        generateDataAttributeDocs(fileContents),
        analyzeTypesForPublic(fileContents),
        generateKeyboardDocs(fileContents),
        generateFeatureList(fileContents)
      ]);

      // Update metadata.json with fresh data only
      const metadata = {
        keyboard: keyboardDocs,
        features: featureList.features
      };
      fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

      console.log("componentComments", componentComments);
      console.log("typeComments", typeComments);
      console.log("dataAttributeComments", dataAttributeComments);
      console.log("keyboardDocs", keyboardDocs);
      console.log("featureList", featureList);
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
          const lineIndex = fileContent.findIndex((l: string) => l.includes(targetLine));
          if (lineIndex !== -1) {
            // Check if there's already a comment above this line
            const hasPreviousComment =
              lineIndex > 0 &&
              (fileContent[lineIndex - 1].includes("/*") ||
                fileContent[lineIndex - 1].includes("//"));

            // Only add comment if there isn't one already
            if (!hasPreviousComment) {
              fileContent.splice(lineIndex, 0, ...comment);
              diffReport += `\nAdded comment to ${block.filename} at line ${lineIndex + 1}\n`;
            }
          }
        }

        fs.writeFileSync(filePath, fileContent.join("\n"), "utf-8");
      }

      // Handle public type transformations
      for (const block of publicTypeAnalysis) {
        const filePath = resolve(componentPath, block.filename);
        if (!isDev) return;
        const sourceFile = getSourceFile(filePath);
        const transformedCode = transformPublicTypes(sourceFile, block.comments);
        fs.writeFileSync(filePath, transformedCode, "utf-8");
        diffReport += `\nTransformed types in ${block.filename}\n`;
      }

      // 2. Handle keyboard interactions separately
      updates.push("Updating API with keyboard interactions...");
      const apiPath = resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`);

      const apiContent = fs.readFileSync(apiPath, "utf-8");
      const apiMatch = apiContent.match(/export const api = ({[\s\S]*});/);
      if (apiMatch) {
        const api = JSON.parse(apiMatch[1]);
        // Only update keyboard interactions, don't touch types
        api.keyboardInteractions = keyboardDocs;
        api.features = featureList.features;
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
  );
});
