import { Document, Input } from "postcss";
import { parseAngular } from "./parser/parser-angular.js";

/**
 * Represents an object that can be converted to a string.
 *
 * @typedef {object} Stringifiable
 * @property {function(): string} toString - Method to convert the object to a string.
 */

/**
 * Parses Angular code and generates a PostCSS Document representing the Abstract Syntax Tree (AST).
 *
 * @param {string | Stringifiable} angularCode - The Angular source code to be parsed, provided either as a string or as an object implementing the toString() method.
 * @param {import('postcss').ProcessOptions} opts - The PostCSS processing options.
 * @returns {Document} A PostCSS Document object representing the parsed AST.
 * @type {import('postcss').Parser<Document>}
 */
export default function parse(angularCode, opts) {
  const input = new Input(angularCode.toString(), opts);

  return parseAngular(input, opts);
}
