import { LinearClient } from "@linear/sdk";
import path from "node:path";
import fs from "node:fs";

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

const team = await linearClient.team("QWIK");
const project = await linearClient.project("af4d86af8e3f");

const prTitle = process.env.PR_TITLE || "No PR Title";
let prDescription: string;

// Read contents of .changeset directory
function readChangesetFiles() {
  const changesetDir = path.join(process.cwd(), ".changeset");
  if (fs.existsSync(changesetDir)) {
    const files = fs.readdirSync(changesetDir);

    for (const file of files) {
      if (path.extname(file) === ".md") {
        const content = fs.readFileSync(path.join(changesetDir, file), "utf-8");
        prDescription += content;
      }
    }
  }
}

readChangesetFiles();

const existingIssues = await linearClient.issues({
  filter: {
    team: { id: { eq: team.id } },
    project: { id: { eq: project.id } },
    title: { eq: prTitle },
  },
});

const existingIssue = existingIssues.nodes[0];

/**
 * Uses the linear SDK. Documentation at:
 * https://developers.linear.app/docs/sdk/getting-started
 */
async function createLinearReleaseIssue() {
  if (existingIssues.nodes.length > 0) {
    console.log(`Issue with title "${prTitle}" already exists.`);
    return;
  }

  const issue = await linearClient.createIssue({
    teamId: team.id,
    title: prTitle,
    description: `
      project: https://github.com/kunai-consulting/kunai-design-system

      ${prDescription}
    `,
    projectId: project.id,
  });

  return issue;
}

// when we add new changesets before the release
async function updateLinearReleaseIssue() {
  const updatedIssue = await linearClient.updateIssue(existingIssue.id, {
    description: `
    project: https://github.com/kunai-consulting/kunai-design-system

    ${prDescription}
  `,
  });

  return updatedIssue;
}

try {
  if (existingIssue) {
    await updateLinearReleaseIssue();
  } else {
    await createLinearReleaseIssue();
  }
} catch (e) {
  console.error("Error from creating linear ticket script: ", e);
}
