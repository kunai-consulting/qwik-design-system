/** Data format of the release.json file */
export type ChangesetData = {
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

export const changesetData: ChangesetData = JSON.parse(
  process.env.CHANGESET_DATA || "{}"
);

export function convertChangesetToMarkdown(
  changesetData: ChangesetData
): string {
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
