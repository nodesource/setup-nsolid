import * as path from "path";
import core from "@actions/core";
import * as tc from "@actions/tool-cache";
import { getNsolidVersion } from "./metadata.js";
import exec from "@actions/exec";

export async function setupNsolid({ nodeVersion, nsolidVersion, platform, arch }) {
  const metadata = await getNsolidVersion({
    nodeVersion,
    nsolidVersion,
    platform,
    arch,
  });

  let toolPath = await downloadNsolid(metadata);
  if (metadata.platform === "win32") {
    toolPath = path.join(core.toWin32Path(`${toolPath}/`));
    core.addPath(toolPath);
    // Delete Current nodejs bin
    try {
      await exec.exec(
        `powershell -command "Remove-Item -Path '${core.toWin32Path(
          "C:/Program Files/nodejs/node.exe",
        )}' -Force -ErrorAction SilentlyContinue"`,
      );
    } catch (error) {
      core.warning(`Failed to remove current nodejs bin ${error}`);
    }

    // Add Nsolid symlink to nodejs folder
    await exec.exec(
      `powershell -command "New-Item -ItemType SymbolicLink -Path '${core.toWin32Path(
        "C:/Program Files/nodejs/node.exe",
      )}' -Target '${core.toWin32Path("C:/Program Files/nsolid/nsolid.exe")}'"`,
    );

    return;
  }

  toolPath = path.join(toolPath, "bin");
  core.addPath(toolPath);
  return;
}

async function downloadNsolid(metadata) {
  let downloadPath = "";
  const extractPath = process.env.RUNNER_TEMP || process.env.RUNNER_WORKSPACE || process.cwd();
  const fileName = `nsolid-v${metadata.nsolidVersion}-${metadata.nodeVersion}-${metadata.platform}-${metadata.arch}`;

  // If the platform is win32, we need to extract the tarball and move the files to a different location.
  if (metadata.platform === "win32") {
    downloadPath = await tc.downloadTool(metadata.url);
    const toolPath = await tc.extractTar(downloadPath, core.toWin32Path("C:/Program Files/nsolid"), [
      "xz",
      "--strip",
      "4",
    ]);
    return toolPath;
  }
  downloadPath = await tc.downloadTool(metadata.url);
  const toolPath = await tc.extractTar(downloadPath, `${extractPath}/${fileName}`, ["xz", "--strip", "1"]);
  return toolPath;
}
