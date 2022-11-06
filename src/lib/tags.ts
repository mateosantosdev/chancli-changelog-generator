const semver = require("semver");
const shell = require("shelljs");
import { cmd } from "./system";
import {
  convertStringToArray,
  buildCommitTypesArray,
  convertCommitsInPlainText,
  generateChangelog,
} from "../utils";
import { COMMIT_TYPES, COMMIT, COMMIT_LIST } from "../types/commits";

const TAGS_COMMAND = `git tag -l --sort=-version:refname`;
const COMMIT_SEPARATOR = "-SEPARATOR-";
const COMPARE_TAGS_COMMAND = `git log --pretty=format:%H%n%s%n%ai%n%an%n%ae%n${COMMIT_SEPARATOR}`;
const CONVENTIONAL_COMMIT_REGEX = /^(\w+)(?:\((.+)\))?: (.+)$/i;
export const CHANGELOG_MARK = "<!-- append_here -->";
export const CHANGELOG_FILE = "CHANGELOG.md";

export const fetch = async () => {
  
  const response = await cmd(TAGS_COMMAND);
  const tags = convertStringToArray(response, "\n");

  try {
    if (tags.length === 0) {
      throw new Error("No tags");
    }

    if (tags.length < 2) {
      throw new Error("You need at lease two Git tags in your project");
    }

    const compare = await cmd(`${COMPARE_TAGS_COMMAND} ${tags[1]}..${tags[0]}`);
    const commits = convertStringToArray(compare, COMMIT_SEPARATOR);
    commits.pop();

    let PARSED_COMMITS: COMMIT_LIST = buildCommitTypesArray();

    if (commits.length > 0) {
      for (const commit of commits) {
        const [hash, commitMessage, date, author, email] = convertStringToArray(
          commit,
          "\n"
        );
        const shortHash = hash.slice(0, 7);

        const item: COMMIT = {
          hash,
          shortHash,
          commitMessage,
          date,
          author,
          email,
        };

        if (CONVENTIONAL_COMMIT_REGEX.test(commitMessage)) {
          const [type] = CONVENTIONAL_COMMIT_REGEX.exec(commitMessage).slice(1);
          if (type) {
            PARSED_COMMITS[type.toUpperCase()].push(item);
          } else {
            PARSED_COMMITS[COMMIT_TYPES.UNKNOWN].push(item);
          }
        } else {
          PARSED_COMMITS[COMMIT_TYPES.UNKNOWN].push(item);
        }
      }
    }

    const changeLogTitle = `\r\n### ${tags[0]}\r\n`;

    const commitsInPlainText = convertCommitsInPlainText(PARSED_COMMITS);

    await generateChangelog(changeLogTitle, commitsInPlainText);

  } catch (e: any) {
    console.log(e);
  }
};
