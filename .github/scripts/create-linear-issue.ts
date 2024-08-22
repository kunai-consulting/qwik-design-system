import { LinearClient } from "@linear/sdk";

/**
 * Uses the linear SDK. Documentation at:
 * https://developers.linear.app/docs/sdk/getting-started
 */
async function createLinearReleaseIssue() {
  const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

  const team = await linearClient.team("QWIK");
  const project = await linearClient.project("af4d86af8e3f");

  const prTitle = process.env.PR_TITLE || "No PR Title";
  const prDescription = process.env.PR_DESCRIPTION || "No PR Description";

  const existingIssues = await linearClient.issues({
    filter: {
      team: { id: { eq: team.id } },
      project: { id: { eq: project.id } },
      title: { eq: prTitle },
    },
  });

  if (existingIssues.nodes.length > 0) {
    console.log(
      `Issue with title "${prTitle}" already exists. Skipping creation.`
    );
    return existingIssues.nodes[0];
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

createLinearReleaseIssue().catch((error) => {
  throw error;
});
