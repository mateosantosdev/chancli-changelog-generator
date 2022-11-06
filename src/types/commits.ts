export enum COMMIT_TYPES {
  FEAT = "Features",
  FIX = "Fixes",
  CHORE = "Chore",
  REFACTOR = "Refactors",
  PERF = "Perf",
  STYLE = "Styles",
  TEST = "Tests",
  DOCS = "Docs",
  BUILD = "Builds",
  OPS = "Ops",
  UNKNOWN = "UNKNOWN"
}

export type COMMIT = {
  hash: string;
  shortHash: string;
  commitMessage: string;
  date: string;
  author: string;
  email: string;
};

export type COMMIT_LIST = {
  [key: string]: COMMIT[];
}
