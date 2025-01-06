import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { Anthropic } from "@anthropic-ai/sdk";
import * as fs from "node:fs";
import { resolve } from "node:path";
import { AIButton } from "./ai-button";

const generateInitialDocs = server$(async (promptPrefix: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `${promptPrefix}

        Write a brief sentence describing the component. 

        Some examples:
        - Display and navigate through multiple content items. (Carousel)
        - A set of interactive sections that show or hide connected information. (Accordion)
        - A panel that appears above all other content, blocking interaction with the rest of the page. (Modal)

        After the description, add the hero showcase component with:

        <Showcase name="hero" />

        Then add the exact text:

        ## Features

        <Features api={api} />

        ## Anatomy

        <AnatomyTable api={api} />

        Now add document any examples that are absolutely critical to the accessibility of the component, for example, adding an accessible label to a checkbox.

        Group the examples with an h2 title, with the h3's being the examples. Otherwise, just add the h3's.

        This is NOT related to anything to do with the component state (initial, reactive, uncontrolled, controlled, events, disabled, etc.)

        Then provide a transition paragraph into the state documentation.
        `
      }
    ]
  });
});

const generateStateDocs = server$(async (promptPrefix: string) => {
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 8192,
    messages: [
      {
        role: "user",
        content: `${promptPrefix}

        You are now writing the documentation specific to the state of the component.

        Find and gather the examples that belong to the state section.

        Write an h2 with the text "Component State"

        From there, look for examples that would fall under this category.

        For example:

        Initial values:

        Example:

        To set a default or initial value on page load, use the value prop on the <Accordion.Root /> component.

        Reactive values:

        Example:

        ### Reactive value
        
        Pass reactive state by using the bind:value prop on the <Accordion.Root /> component.

        <Showcase name="reactive" />

        Events:

        ### Handling selection changes

        <Showcase name="change" />

        Use the onChange$ prop to listen for changes in the selected value. It provides the new selected value as an argument.

        ### Disabled

        <Showcase name="disabled" />

        To disable the component, set the disabled prop to true on the <Accordion.Root /> component.

        `
      }
    ]
  });
});

const readFiles = server$(async (path: string) => {
  try {
    const stats = fs.statSync(path);

    if (stats.isDirectory()) {
      const files = fs.readdirSync(path);
      const contents = files
        .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
        .map((file) => fs.readFileSync(resolve(path, file), "utf-8"))
        .join("\n");
      return contents;
    }
    return fs.readFileSync(path, "utf-8");
  } catch (e) {
    console.warn(`Could not read from ${path}:`, e);
    return "";
  }
});

const writeDocs = server$(async (mdxContent: string, route: string) => {
  try {
    const docsPath = resolve(process.cwd(), `src/routes/${route}/index.mdx`);
    fs.writeFileSync(docsPath, mdxContent);
    return "Documentation updated successfully!";
  } catch (error) {
    console.error("Error writing docs:", error);
    throw new Error(
      `Failed to write documentation: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
});

const getFilePaths = server$(async (route: string) => {
  const { resolve } = await import("node:path");
  return {
    examplesPath: resolve(process.cwd(), `src/routes/${route}/examples`),
    apiPath: resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`),
    componentPath: resolve(process.cwd(), `../../libs/components/src/${route}`)
  };
});

export const DocsAI = component$(() => {
  const isGenerating = useSignal(false);
  const status = useSignal("");
  const loc = useLocation();
  const route = loc.url.pathname.split("/").filter(Boolean)[0];

  return (
    <AIButton
      onClick$={async () => {
        isGenerating.value = true;
        try {
          const paths = await getFilePaths(route);

          status.value = "Reading component files...";
          const [formattedExamples, formattedComponents, formattedAPI] =
            await Promise.all([
              readFiles(paths.examplesPath),
              readFiles(paths.componentPath),
              readFiles(paths.apiPath)
            ]);

          const promptPrefix = `
            Act as a professional documentation writer for a design system that uses Qwik.

            You will be given a component implementation and examples. Each new component or example is separated by ---NEW COMPONENT--- or ---NEW EXAMPLE---.

            You will also be given an object that contains API's found.

            Component implementation:
            ${formattedComponents.split("\n\n").join("\n\n---NEW COMPONENT---\n\n")}

            Examples:
            ${formattedExamples.split("\n\n").join("\n\n---NEW EXAMPLE---\n\n")}

            API's:
            ${formattedAPI}

            When adding examples, make sure to use the <Showcase name="example-file-name" /> component.

            For each example, explain the highlighted API's that are used in the example.

            Example:
            We can select an initial uncontrolled value by passing the open prop to the <Collapsible.Root /> component.

            <Showcase name="initial" /> (initial is the file name)

            When mentioning an API or component surround it with backticks.
          `;

          console.log("promptPrefix:", promptPrefix);

          status.value = "Generating initial documentation...";
          const initialResponse = await generateInitialDocs(promptPrefix);
          const initialDocs = getResponseText(initialResponse);
          const stateResponse = await generateStateDocs(promptPrefix);
          const stateDocs = getResponseText(stateResponse);

          console.log("initialDocs:", initialDocs);
          console.log("stateDocs:", stateDocs);

          status.value = "Evaluating documentation...";

          const mdxContent = [
            'import { api } from "./auto-api/api";',
            initialDocs,
            stateDocs,
            "## Anatomy\n\n<AnatomyTable />",
            "<APITable api={api} />"
          ].join("\n\n");

          status.value = "Saving documentation...";
          const result = await writeDocs(mdxContent, route);
          status.value = result;
        } catch (error) {
          console.error("Error generating docs:", error);
          status.value = `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`;
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

const getResponseText = (response: Anthropic.Messages.Message) => {
  const content = response.content[0];
  return content?.type === "text" ? content.text : "";
};
