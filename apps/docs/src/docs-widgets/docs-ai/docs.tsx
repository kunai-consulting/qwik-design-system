import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Anthropic } from "@anthropic-ai/sdk";
import { component$, useSignal } from "@builder.io/qwik";
import { server$, useLocation } from "@builder.io/qwik-city";
import { AIButton } from "./ai-button";

export const DocsAI = component$(() => {
  const isGenerating = useSignal(false);
  const status = useSignal("");
  const currentDocs = useSignal("");
  const loc = useLocation();
  const route = loc.url.pathname.split("/").filter(Boolean)[0];

  const generateInitialDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          Write the title of the component as an h1.
  
          Example:
  
          # Component Name
  
          Then write a brief sentence describing the component in a way that is generic and easy to understand for 15 year olds (maximum 15 words). 
          
          Do not repeat yourself.
          
          Do not mention the words "component" or the component name in the description.
  
          This description should be directly related to what the component does. Do not write about other components or libraries.
  
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
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the state of the component.
  
          Find and gather the examples that belong to the state section.
  
          Write an h2 with the text "Component State"
  
          From there, look for examples that would fall under this category.
  
          Only write something if the state examples exist.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - Configuration examples (filter, loop, etc.)
          - Behavioral examples (empty, inline, etc.)
          - Form examples (form, validation, etc.)
          - Examples you already wrote in this response
  
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
  
          You are then writing the documentation specific to the behavior of the component.
  
          Find and gather examples that are related to the behavior of the component. 
  
          Only write something if the behavioral examples exist.
  
          DO NOT write about anything that mentions or is relatively considered to be part of a component's state. (e.g. initial, reactive, disabled, etc.), this also cover's the exposed component state
  
          Do not repeat content from the previous sections!
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Form examples (form, validation, etc.)
  
          ### Empty UI
  
          By default, the popover automatically closes when there are no items to display.
  
          To show UI when there are no items in the popover, use the Combobox.Empty component.
  
          <Showcase name="empty" />
  
          ### Inline Mode (Command Palette)
  
          The Combobox supports an inline mode which allows for searching and selection from a list of options decoupled from the popover.
  
          To enable inline mode:
          - Add the mode="inline" prop to <Combobox.Root>
          - Use the Combobox.Inline component instead of <Combobox.Popover>.
  
          <Showcase name="inline" />
  
          Key Differences in Inline Mode:
          - Always Visible: The listbox remains visible at all times, even after item selection or pressing Escape
          - Initial State: The first option is automatically highlighted when the combobox renders
          - Selection Behavior:
            - Selecting an item does not close the listbox
            - The input value remains empty after selection
          - Focus Management:
            - Highlight state persists when filtering items
            - Highlight state is preserved when tabbing away and back to the input
  
          Inline mode is useful when you want users to quickly browse and select from a list while maintaining context of all available options.
  
          `
        }
      ]
    });
  });

  const generateConfigDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the configuration of the component.
  
          Find and gather examples that are related to the configuration of the component. 
  
          Only write something if the configuration examples exist.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Behavioral examples (empty, inline, etc.)
          - Form examples (form, validation, etc.)
  
          Determine the h2's and h3's that should be used to organize the examples.
  
          Only write something if the configuration examples exist.
  
          Below are some configuration examples from a headless Combobox component:
  
          ## Menu behavior
  
          ### Custom Filter
  
          By default, the Combobox filters items based on user input. To disable this, set the filter prop to false.
  
          <Showcase name="filter" />
  
          You can use any filtering library. In the example above, we use match-sorter.
  
          > The filter prop is true by default, using the includes method to filter items.
  
          ### Looping
  
          To loop through items, use the loop prop on <Combobox.Root />.
  
          <Showcase name="loop" />
  
          - Pressing the down arrow key moves focus to the first enabled item.
          - Pressing the up arrow key moves focus to the last enabled item.
          `
        }
      ]
    });
  });

  const generateFormDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the configuration of the component.
  
          Find and gather examples that are related to the configuration of the component. 
          
          This is NOT related to the state of the component. (e.g. initial, reactive, disabled, etc.)
  
          Only write something if the form examples exist.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - Environment examples (CSR, SSR, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Behavioral examples (empty, inline, etc.)
  
          Below is an example of how the form section works in a headless Combobox component:
  
          ## Forms
  
          To use the combobox in a form, a visually hidden native select element is provided inside of <Combobox.HiddenNativeSelect>.
  
          <Showcase name="form" />
  
          The name prop on the Combobox.Root component is used to name the Combobox form field.
  
          ## Validation
  
          Form libaries like Modular Forms can be used to validate the combobox form field.
  
          <Showcase name="validation" />
  
          When the <Combobox.ErrorMessage> component is rendered, the component is in an invalid state.
  
          This allows you to use Qwik UI with any form validation library.`
        }
      ]
    });
  });

  const generateEnvDocs = server$(async (promptPrefix: string) => {
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 8192,
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `${promptPrefix}
  
          You are now writing the documentation specific to the environment of the component.
  
          Find and gather examples that are related to the environment of the component. 
          
          This is NOT related to the state of the component. (e.g. initial, reactive, disabled, etc.)
  
          ONLY write something if the environmental examples exist. If they don't exist, your output should be empty.
  
          Do not write about:
  
          - Accessibility (label, description, etc.)
          - State examples (initial, reactive, disabled, etc.)
          - Configuration examples (filter, loop, etc.)
          - Form examples (form, validation, etc.)
  
          Example:
  
          ### CSR
  
          Like every Qwik UI component, the Combobox component can be rendered server-side or client-side.
  
          <Showcase name="csr" />
  
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
          .filter((file: string) => file.endsWith(".ts") || file.endsWith(".tsx"))
          .map((file: string) => fs.readFileSync(resolve(path, file), "utf-8"))
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
    return {
      examplesPath: resolve(process.cwd(), `src/routes/${route}/examples`),
      apiPath: resolve(process.cwd(), `src/routes/${route}/auto-api/api.ts`),
      componentPath: resolve(process.cwd(), `../../libs/components/src/${route}`)
    };
  });

  const writeLogFile = server$(async (content: string) => {
    try {
      if (!fileURLToPath) return;
      const currentFilePath = fileURLToPath(import.meta.url);
      const logPath = resolve(dirname(currentFilePath), "log.mdx");

      console.log("Writing log to:", logPath);
      fs.appendFileSync(logPath, `${content}\n\n---\n\n`, "utf-8");
      return "Log updated successfully!";
    } catch (error) {
      console.error("Error writing log:", error);
      throw new Error(
        `Failed to write log: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  });

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
            ${currentDocs.value !== "" ? `Documentation written for this component so far: ${currentDocs.value}` : ""}
          
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

            Only output production ready documentation.
          `;

          console.log("promptPrefix:", promptPrefix);

          status.value = "Generating initial documentation...";
          const initialResponse = await generateInitialDocs(promptPrefix);
          const initialDocs = getResponseText(initialResponse);
          currentDocs.value += initialDocs;

          status.value = "Generating state documentation...";
          const stateResponse = await generateStateDocs(promptPrefix);
          const stateDocs = getResponseText(stateResponse);
          currentDocs.value += stateDocs;

          status.value = "Generating config documentation...";
          const configResponse = await generateConfigDocs(promptPrefix);
          const configDocs = getResponseText(configResponse);
          currentDocs.value += configDocs;

          status.value = "Generating form documentation...";
          const formResponse = await generateFormDocs(promptPrefix);
          const formDocs = getResponseText(formResponse);
          currentDocs.value += formDocs;

          status.value = "Generating environment documentation...";
          const envResponse = await generateEnvDocs(promptPrefix);
          const envDocs = getResponseText(envResponse);
          currentDocs.value += envDocs;

          const logResults = await writeDocs(currentDocs.value, route);
          await writeLogFile(currentDocs.value);
          status.value = logResults;

          status.value = "Evaluating documentation...";

          const mdxContent = [
            'import { api } from "./auto-api/api";',
            initialDocs,
            stateDocs,
            configDocs.includes("##") ? configDocs : "",
            formDocs.includes("##") ? formDocs : "",
            // Only add the environment documentation if it exists
            envDocs.includes("##") ? envDocs : "",
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
