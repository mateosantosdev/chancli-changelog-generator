const { spawn } = require("child_process");
import * as fs from "fs";

export const cmd = async (string: string): Promise<string> => {
  const [cmd, ...args] = string.trim().split(" ");
  const child = await spawn(cmd, args);

  let result = "";
  for await (const data of child.stdout) {
    result += data.toString();
  }

  return result;
};

export const readFile = async (file: string) => {
  const data = fs.readFileSync(file, "utf8");
  return data;
};

export const writeFile = async (file: string, content: string) => {
  fs.writeFileSync(file, content);
};
