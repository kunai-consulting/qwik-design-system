import { LinearClient } from "@linear/sdk";

/**
 * Uses the linear SDK. Documentation at:
 * https://developers.linear.app/docs/sdk/getting-started
 */
async function createLinearIssue() {
  const linearClient = new LinearClient({ apiKey: process.env.LINEAR_API_KEY });

  const team = await linearClient.team("QWIK");
  const project = await linearClient.project("af4d86af8e3f");

  const issue = await linearClient.createIssue({
    teamId: team.id,
    title: "Test",
    description: "This is a test issue Jack has created with the linear SDK.",
    projectId: project.id,
  });

  return issue;
}

createLinearIssue().catch((error) => {
  throw error;
});
