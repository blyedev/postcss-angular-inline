import { Document } from "postcss";
import { Input } from "postcss";
import { AngularParser } from "./parser-angular.js";

/**
 * Parses Angular code and returns a Document.
 *
 * @type {import('postcss').Parser<Document>}
 */
export default function parse(angularCode, opts) {
  const input = new Input(angularCode.toString(), opts);

  const angularParser = new AngularParser(input);
  angularParser.parse(opts);

  return angularParser.doc;
}
