import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dirPath = join(__dirname, "fixtures");

/**
 * @typedef {object} Fixture
 * @property {string} filename Filename of fixture
 * @property {string} path Absolute path of fixture
 * @property {string} code Code of fixture
 */

/**
 * Retrieves a test case
 * @param {string} filename Path of fixture
 * @returns {Fixture} Retrieved fixture
 */
export function getFixtureCode(filename) {
  const path = join(dirPath, filename);
  const code = readFileSync(path, "utf-8");
  return { filename, path, code };
}

/**
 * Get all availible fixture paths
 * @returns {string[]} All available fixture filenames
 */
export function getAllFixtureFilenames() {
  return readdirSync(dirPath);
}
