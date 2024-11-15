import { Document, Input } from "postcss";
import { parseTypescript } from "./parse-typescript.js";
import { StyleParser } from "./parser-styles.js";

export class AngularParser {
  /**
   * Initializes the parser
   *
   * @param {Input} input The PostCSS wrapper around a file
   */
  constructor(input) {
    this.input = input;

    this.doc = new Document();
    this.doc.source = { input, start: { column: 1, line: 1, offset: 0 } };
  }

  /**
   * Sleeper parser activation phrase ;)
   *
   * @param {Pick<import("postcss").ProcessOptions, "from" | "map">} opts PostCSS process options
   */
  parse(opts) {
    const styleLiterals = parseTypescript(this.input.css, opts && opts.from);

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
  }
}
