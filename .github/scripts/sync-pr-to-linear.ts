import { LinearClient } from "@linear/sdk";
import { existingIssue } from "./update-linear";

async function syncPrToLinear() {
  const linearClient = new LinearClient({
    apiKey: process.env.LINEAR_API_KEY,
  });

  const commentBody = process.env.COMMENT_BODY;

  const createdComment = await linearClient.createComment({
    issueId: existingIssue.id,
    body: commentBody,
  });

  console.log(`Comment added to Linear issue ${existingIssue.id}`);
  return createdComment;
}

syncPrToLinear().catch((error) => {
  console.error("Failed to sync comments:", error);
  process.exit(1); // Exit with error code
});
