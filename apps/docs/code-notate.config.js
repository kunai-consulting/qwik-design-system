/** @type {import('@kunai-consulting/code-notate').CodeNotateConfig} */
export default {
  aiModel: "claude-3-5-sonnet-20241022",
  aiProvider: "anthropic",
  documentationFolder: "./src/routes/base",
  formatCommand: "pnpm format",
  formatDirectory: "../..",
  framework: "Qwik",
  sourceFolder: "../../libs/components/src/pagination"
};
