import { LinearClient } from "@linear/sdk";

const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

const team = await linearClient.team("QWIK");
const project = await linearClient.project("af4d86af8e3f");

const issueTitle = process.env.PR_TITLE || "No PR Title";
const existingIssues = await linearClient.issues({
  filter: {
    team: { id: { eq: team.id } },
    project: { id: { eq: project.id } },
    title: { eq: issueTitle },
  },
});

const existingIssue = existingIssues.nodes[0];

/** Data format of the release.json file */
type ChangesetData = {
  changesets: Array<{
    summary: string;
    releases: Array<{
      name: string;
      type: string;
    }>;
  }>;
  releases: Array<{
    name: string;
    type: string;
  }>;
};

const changesetData: ChangesetData = JSON.parse(
  process.env.CHANGESET_DATA || "{}"
);

function convertChangesetToMarkdown(changesetData: ChangesetData): string {
  const { changesets, releases } = changesetData;

  const changesetsByPackage: { [key: string]: string[] } = {};

  // Initialize changesetsByPackage with empty arrays for all releases
  for (const release of releases) {
    changesetsByPackage[release.name] = [];
  }

  // Associate changes with packages based on the releases array in each changeset
  for (const changeset of changesets) {
    for (const release of changeset.releases) {
      if (changesetsByPackage[release.name]) {
        changesetsByPackage[release.name].push(changeset.summary);
      }
    }
  }

  const markdownParts = releases
    .filter((release) => release.type !== "none")
    .map((release) => {
      const changes = changesetsByPackage[release.name];
      const changesText =
        changes.length > 0 ? changes.join("\n") : "No changes";

      return `### ${release.name}
- **Type**: ${release.type}

${changesText}`;
    });

  return markdownParts.join("\n\n").trim();
}

const issueDescription = `
## Release Summary

This issue tracks the changes for the upcoming release of the Qwik Design System.

Project: https://github.com/kunai-consulting/qwik-design-system

${convertChangesetToMarkdown(changesetData)}

`;

/**
 * Uses the linear SDK. Documentation at:
 * https://developers.linear.app/docs/sdk/getting-started
 */
async function createLinearReleaseIssue() {
  if (existingIssues.nodes.length > 0) {
    console.log(`Issue with title "${issueTitle}" already exists.`);
    return;
  }

  const issue = await linearClient.createIssue({
    teamId: team.id,
    title: issueTitle,
    description: issueDescription,
    projectId: project.id,
  });

  return issue;
}

// when we add new changesets before the release
async function updateLinearReleaseIssue() {
  const updatedIssue = await linearClient.updateIssue(existingIssue.id, {
    description: issueDescription,
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
