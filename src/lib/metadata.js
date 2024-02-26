import core from "@actions/core";
import { request } from "undici";
import { getSemverMaxSatisfying } from "./utils.js";

/**
 * Fetches the latest N|Solid version and its metadata.
 *
 * @async
 * @param {Object} params - The parameters for fetching the N|Solid version.
 * @param {string} params.nodeVersion - The Node.js version.
 * @param {string} params.nsolidVersion - The N|Solid version.
 * @param {string} params.platform - The platform.
 * @param {string} params.arch - The architecture.
 * @returns {Promise<Object>} A promise that resolves with an object containing the URL, N|Solid version, and Node.js version.
 * @throws {Error} If there's an error while fetching the N|Solid version or its metadata.
 * @property {string} url - The URL to download the N|Solid artifact.
 * @property {string} nsolidVersion - The N|Solid version.
 * @property {string} nodeVersion - The Node.js version.
 */

export async function getNsolidVersion({ nodeVersion, nsolidVersion, platform, arch }) {
  try {
    const metadata = await getMetadata({ nodeVersion, nsolidVersion, platform, arch });
    return metadata;
  } catch (error) {
    core.setFailed(`Action failed with error ${error}`);
  }
}

async function getMetadata({ nodeVersion, nsolidVersion, platform, arch }) {
  try {
    const { statusCode, body } = await request("https://nsolid-download.nodesource.com/download/metadata.json");
    if (statusCode !== 200) {
      core.setFailed(`Action failed to download the metadata. Status code: ${statusCode}`);
    }

    const metadata = await body.json();

    // If the version is "latest" we need to get the latest version from the metadata.
    // Otherwise we need to get the highest version that satisfies the range, We use the major version as input.
    if (nsolidVersion === "latest") {
      nsolidVersion = getSemverMaxSatisfying(Object.keys(metadata), "*");
    } else {
      nsolidVersion = getSemverMaxSatisfying(Object.keys(metadata), nsolidVersion);
    }

    if (nodeVersion === "latest") {
      nodeVersion = getSemverMaxSatisfying(Object.keys(metadata[nsolidVersion].versions), "*");
    } else {
      nodeVersion = getSemverMaxSatisfying(Object.keys(metadata[nsolidVersion].versions), nodeVersion);
    }

    core.info(
      `N|Solid version: ${nsolidVersion} compatible with Node.js version: ${nodeVersion}\nPlatform: ${platform}\nArch: ${arch}`,
    );

    return {
      url: metadata[nsolidVersion].binaries[platform][arch][nodeVersion],
      nsolidVersion: nsolidVersion,
      nodeVersion: nodeVersion,
      platform: platform,
      arch: arch,
    };
  } catch (error) {
    core.setFailed(`Action failed to get metadata with error ${error}`);
  }
}
