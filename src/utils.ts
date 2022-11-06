import { COMMIT_TYPES, COMMIT_LIST } from "./types/commits";
import { CHANGELOG_FILE, CHANGELOG_MARK } from "./lib/tags";
import { readFile, writeFile } from "./lib/system";

export const COMMIT_URL = process.env.COMMIT_URL;

export const convertStringToArray = (
  sentence: string,
  separator: string
): string[] => {
  return sentence.trim().split(separator);
};

export const convertCommitsInPlainText = (commits: COMMIT_LIST): string => {
  let plainText = "";
  for (const commitType in commits) {
    if (commits[commitType].length > 0) {
      plainText += `\r\n#### ${
        commitType !== COMMIT_TYPES.UNKNOWN
          ? COMMIT_TYPES[commitType]
          : "Other:"
      }\r\n`;
    }
    for (const commitContent of commits[commitType]) {
      const { hash, shortHash, commitMessage, date, author, email } =
        commitContent;
      plainText += `* [${shortHash}](${COMMIT_URL}/${hash}) ${commitMessage} | ${date} | ${author} - ${email}\r\n`;
    }
  }
  return plainText;
};

export const buildCommitTypesArray = (): COMMIT_LIST => {
  let types: COMMIT_LIST = {};
  for (const commitType in COMMIT_TYPES) {
    types[commitType] = [];
  }
  return types;
};

export const generateChangelog = async (
  title: string,
  commitsInPlainText: string
) => {
  const changelogFile = await readFile(CHANGELOG_FILE);
  const idx = changelogFile.indexOf(CHANGELOG_MARK) + CHANGELOG_MARK.length;

  const newContent =
    changelogFile.slice(0, idx) +
    title +
    commitsInPlainText +
    changelogFile.slice(idx);

  await writeFile(CHANGELOG_FILE, newContent);
};
