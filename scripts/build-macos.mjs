import { spawnSync } from "node:child_process";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

if (process.platform !== "darwin") {
  console.error("macOS packages must be built on macOS or a macOS CI runner.");
  process.exit(1);
}

const projectDir = process.cwd();
const outputDir = path.resolve(projectDir, "release-mac");
await mkdir(outputDir, { recursive: true });

const require = createRequire(import.meta.url);
const builderCli = require.resolve("electron-builder/cli.js");
const result = spawnSync(process.execPath, [
  builderCli,
  "--mac",
  "dmg",
  "zip",
  "--universal",
  "--publish",
  "never",
  `--config.directories.output=${outputDir}`,
], {
  cwd: projectDir,
  stdio: "inherit",
  env: {
    ...process.env,
    CSC_IDENTITY_AUTO_DISCOVERY: "false",
  },
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

console.log(`Unsigned macOS artifacts are available in ${outputDir}`);
