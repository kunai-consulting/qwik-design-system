import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateDocs = server$(async (route: string) => {
  try {
    console.log("Starting docs generation for route:", route);

    // Validate API key first
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    // Consolidated file reading and formatting
    const readAndFormatFiles = (
      path: string,
      filter = (f: string) => f.endsWith(".tsx")
    ) => {
      if (!fs.existsSync(path)) {
        throw new Error(`No folder found at ${path}`);
      }

      return fs
        .readdirSync(path)
        .filter(filter)
        .map((file) => ({
          name: file,
          content: fs.readFileSync(resolve(path, file), "utf-8")
        }))
        .map(({ name, content }) => `=== ${name} ===\n${content}\n`)
        .join("\n");
    };

    const examplesPath = resolve(process.cwd(), `src/routes/${route}/examples`);
    const componentPath = resolve(process.cwd(), `../../libs/components/src/${route}`);

    const formattedExamples = readAndFormatFiles(examplesPath);
    const formattedComponents = readAndFormatFiles(componentPath);

    console.log("Found examples:", formattedExamples);
    console.log("formattedComponents:", formattedComponents);

    const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
    let existingDocs = "";
    try {
      existingDocs = fs.readFileSync(docsPath, "utf-8");
      console.log("Found existing docs");
    } catch (e) {
      console.log("No existing docs found");
    }

    const updates = [];

    const initialResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Create component documentation following this structure:

        Component implementation:
        ${formattedComponents}

        Examples:
        ${formattedExamples}

        Write documentation that:
        1. Start with a practical description focused on what users can do with it
           Example: "A checkbox lets users select or deselect an option."
           - Use simple, direct language
           - One line only
           - Focus on the core action users can take
        
        2. Preview section with <Showcase name="hero" />
        
        3. Building blocks section with basic implementation
        
        4. For each usage pattern:
           - Write a brief, practical explanation focused on user needs
           - Add <Showcase name="[example-file-name]" /> using the actual example file names
           - No code blocks (they're handled by the Showcase component)
        
        5. Group patterns from basic to advanced
        
        6. Add keyboard interactions at the end if applicable

        Focus on what users can do with the component rather than technical descriptions.`
        }
      ]
    });

    const evaluationResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Review this documentation against the component:

        Component implementation:
        ${formattedComponents}

        Examples:
        ${formattedExamples}

        Documentation to review:
        ${getResponseText(initialResponse)}

        Check for:
        1. Simple, direct language in descriptions
           - One line for component description
           - Focus on core user actions
           - No marketing terms like "versatile" or "powerful"
        
        2. Proper showcase components:
           - <Showcase name="hero" /> for preview
           - <Showcase name="[example-file-name]" /> using actual file names
           - No code blocks
        
        3. Brief, practical explanations for each pattern
        4. Logical progression from basic to advanced patterns
        
        Provide specific improvement suggestions.`
        }
      ]
    });

    const finalResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: `Improve this documentation based on the evaluation while maintaining:

        Component implementation:
        ${formattedComponents}

        Examples:
        ${formattedExamples}

        Original docs:
        ${getResponseText(initialResponse)}

        Editor feedback:
        ${getResponseText(evaluationResponse)}

        Requirements:
        1. Keep language simple and direct
        2. Focus on user actions and practical usage
        3. Use proper showcase components
        4. Brief explanations for each pattern
        5. No code blocks`
        }
      ]
    });

    const mdxContent = [
      'import { api } from "./auto-api/api";',
      getResponseText(finalResponse),
      `## Anatomy\n\n<AnatomyTable />`,
      "<APITable api={api} />"
    ].join("\n\n");

    fs.writeFileSync(docsPath, mdxContent);
    updates.push("Documentation updated");

    return updates;
  } catch (error) {
    console.error("Error generating docs:", error);
    return [
      `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
    ];
  }
});

const getResponseText = (response: Anthropic.Messages.Message) => {
  const content = response.content[0];
  return content?.type === "text" ? content.text : "";
};

export const DocsAI = component$(() => {
  const isGenerating = useSignal(false);
  const status = useSignal("");
  const loc = useLocation();
  const route = loc.url.pathname.split("/").filter(Boolean)[0];

  return (
    <AIButton
      onClick$={async () => {
        isGenerating.value = true;
        status.value = "Generating...";
        try {
          const updates = await generateDocs(route);
          status.value = updates[updates.length - 1] || "";
        } finally {
          isGenerating.value = false;
        }
      }}
      disabled={isGenerating.value}
    >
      {isGenerating.value ? status.value : "Generate Docs"}
    </AIButton>
  );
});
