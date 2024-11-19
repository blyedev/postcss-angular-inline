import { Document, Input } from "postcss";
import { TypescriptParser } from "./parser-typescript.js";
import { StyleParser } from "./parser-styles.js";

/**
 * Represents a parser that processes Angular component styles within TypeScript files.
 */
export class AngularParser {
  /**
   * Constructs a new instance of the AngularParser.
   *
   * @param {Input} input - The PostCSS `Input` object wrapping the source file.
   */
  constructor(input) {
    this.input = input;

    this.doc = new Document();
    this.doc.source = { input, start: { column: 1, line: 1, offset: 0 } };
  }

  /**
   * Parses the input TypeScript file to extract and process Angular component styles.
   *
   * @param {Pick<import("postcss").ProcessOptions, "from" | "map">} opts - The PostCSS processing options.
   * @returns {Document} The root node of the generated Abstract Syntax Tree (AST).
   */
  parse(opts) {
    const typescriptParser = new TypescriptParser(this.input);
    const styleLiterals = typescriptParser.parse();

    let index = 0;
    styleLiterals.forEach((styleLiteral, idx) => {
      const styleParser = new StyleParser(this.input, styleLiteral);
      const stylesRoot = styleParser.parse(opts);

      const start = styleLiteral.getStart() + 1;
      const end = styleLiteral.getEnd() - 1;

      stylesRoot.raws.codeBefore = this.input.css.slice(index, start);

      const isLast = idx === styleLiterals.length - 1;
      if (isLast) {
        stylesRoot.raws.codeAfter = this.input.css.slice(end);
      } else {
        stylesRoot.raws.codeAfter = this.input.css.slice(end, end + 1);
      }

      index = end + 1;
      this.doc.push(stylesRoot);
    });

    return this.doc;
  }
}
