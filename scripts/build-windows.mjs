import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";

const projectDir = process.cwd();
const systemTemp = path.resolve(os.tmpdir());
const tempOutput = path.resolve(systemTemp, "focus-calendar-electron-builder");
const projectOutput = path.resolve(projectDir, "release-build");

if (!tempOutput.startsWith(`${systemTemp}${path.sep}`) || path.basename(tempOutput) !== "focus-calendar-electron-builder") {
  throw new Error(`Refusing to use unexpected temporary directory: ${tempOutput}`);
}

await rm(tempOutput, { recursive: true, force: true });
await mkdir(tempOutput, { recursive: true });

const require = createRequire(import.meta.url);
const builderCli = require.resolve("electron-builder/cli.js");
const result = spawnSync(process.execPath, [
  builderCli,
  "--win",
  "nsis",
  "--publish",
  "never",
  `--config.directories.output=${tempOutput}`,
], { cwd: projectDir, stdio: "inherit" });

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

await mkdir(projectOutput, { recursive: true });
const artifacts = (await readdir(tempOutput)).filter((name) =>
  name.endsWith(".exe") || name.endsWith(".blockmap") || name === "latest.yml",
);

for (const artifact of artifacts) {
  await copyFile(path.join(tempOutput, artifact), path.join(projectOutput, artifact));
}

console.log(`Copied ${artifacts.length} release artifact(s) to ${projectOutput}`);
