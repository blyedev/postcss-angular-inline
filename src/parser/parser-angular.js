import { Input } from "postcss";
import { StyleParser } from "./parser-styles.js";
import { Document } from "../nodes/document.js";
import { parseTypescript } from "./parse-typescript.js";

/**
 * Parses the input TypeScript file to extract and process Angular component styles.
 *
 * @param {Input} input - The PostCSS `Input` object wrapping the source file.
 * @param {Pick<import("postcss").ProcessOptions, "from" | "map">} opts - The PostCSS processing options.
 * @returns {Document} The root node of the generated Abstract Syntax Tree (AST).
 */
export function parseAngular(input, opts) {
  const styleLiterals = parseTypescript(input);

  let index = 0;
  const nodes = styleLiterals.map((styleLiteral, idx) => {
    const styleParser = new StyleParser(input, styleLiteral);
    const stylesRoot = styleParser.parse(opts);

    stylesRoot.raws.codeBefore = input.css.slice(
      index,
      styleLiteral.getStart(),
    );

    index = styleLiteral.getEnd();

    // In case this is the last style node we save the rest of the file
    if (idx === styleLiterals.length - 1) {
      stylesRoot.raws.codeAfter = input.css.slice(index);
    }

    return stylesRoot;
  });

  const offset = input.css.length - 1;
  const { col: column, line } = input.fromOffset(offset);

  return new Document({
    nodes,
    source: {
      input,
      start: { column: 1, line: 1, offset: 0 },
      end: {
        column,
        line,
        offset,
      },
    },
  });
}
