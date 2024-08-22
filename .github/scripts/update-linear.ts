import { LinearClient } from "@linear/sdk";
import read from "@changesets/read";

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

const team = await linearClient.team("QWIK");
const project = await linearClient.project("af4d86af8e3f");

const prTitle = process.env.PR_TITLE || "No PR Title";
let prDescription: string;

// Read contents of .changeset directory
async function readChangesetFiles() {
  try {
    const changesets = await read(process.cwd());
    const packageChanges: Record<
      string,
      Array<{ type: string; summary: string }>
    > = {};

    for (const changeset of changesets) {
      for (const release of changeset.releases) {
        if (!packageChanges[release.name]) {
          packageChanges[release.name] = [];
        }
        packageChanges[release.name].push({
          type: release.type,
          summary: changeset.summary,
        });
      }
    }

    prDescription = `
## Release Summary

This issue tracks the changes for the upcoming release of the Qwik Design System.

Project: https://github.com/kunai-consulting/qwik-design-system

`;

    for (const [packageName, changes] of Object.entries(packageChanges)) {
      prDescription += `### ${packageName}\n\n`;
      for (const change of changes) {
        prDescription += `- **${change.type}**:\n ${change.summary}\n`;
      }
      prDescription += "\n";
    }
  } catch (error) {
    console.error("Error reading changesets:", error);
    process.exit(1);
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
    description: prDescription,
    projectId: project.id,
  });

  return issue;
}

// when we add new changesets before the release
async function updateLinearReleaseIssue() {
  const updatedIssue = await linearClient.updateIssue(existingIssue.id, {
    description: prDescription,
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
