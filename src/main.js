import os from "node:os";
import core from "@actions/core";
import { setupNsolid } from "./lib/install.js";

export async function run() {
  try {
    const arch = core.getInput("arch") || os.arch();
    const platform = core.getInput("platform") || os.platform();
    const nodeVersion = core.getInput("node-version") || "latest";
    const nsolidVersion = core.getInput("nsolid-version") || "latest";

    await setupNsolid({
      nodeVersion,
      nsolidVersion,
      platform,
      arch,
    });
    return setupNsolid;
  } catch (err) {
    core.setFailed(err.message);
  }
}
