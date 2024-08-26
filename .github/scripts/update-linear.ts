import { LinearClient } from "@linear/sdk";
import { convertChangesetToMarkdown, changesetData } from "./changeset-md";

const linearClient = new LinearClient({
  apiKey: process.env.LINEAR_API_KEY,
});

const team = await linearClient.team("QWIK");
const project = await linearClient.project("af4d86af8e3f");

const githubUrl = "https://github.com/kunai-consulting/qwik-design-system";
const repoName = "Qwik Design System";
const linkedPrUrl = `${githubUrl}/pull/${process.env.PR_NUMBER}`;

const issueTitle = process.env.PR_TITLE || "No PR Title";
const existingIssues = await linearClient.issues({
  filter: {
    team: { id: { eq: team.id } },
    project: { id: { eq: project.id } },
    title: { eq: issueTitle },
  },
});

export const existingIssue = existingIssues.nodes[0];

const issueDescription = `
## Release Summary

This issue tracks the changes for the upcoming release of the ${repoName}.

Project: ${githubUrl}

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

  // user that created the API
  const me = await linearClient.viewer;

  const inProgress =
    (await team.states()).nodes.find((state) => state.position === 3)?.id ??
    undefined;

  const issuePayload = await linearClient.createIssue({
    teamId: team.id,
    title: issueTitle,
    description: issueDescription,
    projectId: project.id,
    priority: 1,
    assigneeId: me.id,
    stateId: inProgress,
  });

  const issueId = (await issuePayload.issue)?.id;

  if (!issueId) {
    throw new Error(
      "Update Linear: Issue Id needed for attachement to be creted."
    );
  }

  await linearClient.createAttachment({
    issueId: issueId,
    url: linkedPrUrl ?? "",
    title: "GitHub Pull Request",
    subtitle: issueTitle,
  });

  return issuePayload;
}

// when we add new changesets before the release
async function updateLinearReleaseIssue() {
  const updatedIssuePayload = await linearClient.updateIssue(existingIssue.id, {
    description: issueDescription,
  });

  // this for sure works, if we can't find the id in createLinearReleaseIssue
  // await linearClient.createAttachment({
  //   issueId: existingIssue.id,
  //   url: linkedPrUrl ?? "",
  //   title: "GitHub Pull Request",
  //   subtitle: issueTitle,
  // });

  return updatedIssuePayload;
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
