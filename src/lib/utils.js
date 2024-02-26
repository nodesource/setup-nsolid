import semverMaxSatisfying from "semver/ranges/max-satisfying.js";
/**
 * Returns the highest version in the list that satisfies the range, or `null` if none of them do.
 *
 * @param {string[]} versions - An array of version strings to compare.
 * @param {string} versions - the range for semver to find the max value can be a * or a number.
 * @returns {string|null} The highest version in the list that satisfies the range, or `null` if none of them do.
 */
export function getSemverMaxSatisfying(versions, range) {
  return semverMaxSatisfying(versions, range);
}
