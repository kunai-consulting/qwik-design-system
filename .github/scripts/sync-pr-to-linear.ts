import { LinearClient } from "@linear/sdk";

async function syncPrToLinear() {
  const linearClient = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });

  const team = await linearClient.team("QWIK");
  const project = await linearClient.project("af4d86af8e3f");

  // Extract the version number from the PR title
  const prTitle = process.env.PR_TITLE;
  const versionMatch = prTitle?.match(/Release QDS v([\d.]+)/);
  const version = versionMatch ? versionMatch[1] : null;

  if (!version) {
    console.error("Could not extract version from PR title");
    process.exit(1);
  }

  const issueTitle = `Release QDS v${version}`;

  const existingIssues = await linearClient.issues({
    filter: {
      team: { id: { eq: team.id } },
      project: { id: { eq: project.id } },
      title: { eq: issueTitle },
    },
  });

  const existingIssue = existingIssues.nodes[0];

  if (!existingIssue) {
    console.error(`No existing issue found with title: ${issueTitle}`);
    process.exit(1);
  }

  const commentBody = process.env.COMMENT_BODY;

  const createdComment = await linearClient.createComment({
    issueId: existingIssue.id,
    body: commentBody,
  });

  console.log(`Comment added to Linear issue ${existingIssue.id}`);
  return `@[${process.env.COMMENT_AUTHOR}](${process.env.COMMENT_AUTHOR_PROFILE}): ${createdComment}`;
}

syncPrToLinear().catch((error) => {
  console.error("Failed to sync comments:", error);
  process.exit(1);
});
