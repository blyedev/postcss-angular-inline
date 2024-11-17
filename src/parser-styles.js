import postcss from "postcss";
/**
 * Class to adjust node locations within the source code.
 */
export class StyleParser {
  /**
   * Constructor
   *
   * @param {postcss.Input} input - An instance of the Locations class.
   * @param {import("ts-morph").StringLiteral | import("ts-morph").NoSubstitutionTemplateLiteral} styleLiteral - The style literal node.
   */
  constructor(input, styleLiteral) {
    this.input = input;

    const { col, line } = input.fromOffset(styleLiteral.getStart());
    this.column = col - 1;
    this.line = line - 1;
    this.styleLiteral = styleLiteral;
  }

  _adjustPosition(object) {
    if (object) {
      if (object.line === 1) {
        object.column += this.column;
      }
      object.line += this.line;
      if (typeof object.offset === "number") {
        object.offset += this.styleLiteral.getStart();
      }
      if (typeof object.endLine === "number") {
        if (object.endLine === 1) {
          object.endColumn += this.column;
        }
        object.endLine += this.line;
      }
    }
  }

  _adjustNode(node) {
    this._adjustPosition(node.source.start);
    this._adjustPosition(node.source.end);
  }

  /**
   * Adjusts the position of source to be relative to the entire file not input css
   *
   * @param {postcss.Root} root The root of all styles to be adjusted
   */
  _adjustAllNodes(root) {
    this._adjustNode(root);
    root.source = {
      ...root.source,
      input: this.input,
    };

    root.walk((node) => {
      this._adjustNode(node);
    });
  }

  _adjustError(error) {
    if (error && error.name === "CssSyntaxError") {
      this._adjustPosition(error);
      this._adjustPosition(error.input);
      error.message = error.message.replace(
        /:\d+:\d+:/,
        `:${error.line}:${error.column}:`,
      );
    }
    return error;
  }

  parse(opts) {
    const styleLiteral = this.styleLiteral;
    let root;
    try {
      root = postcss.parse(
        styleLiteral.getLiteralText(),
        Object.assign({}, opts, { map: false }),
      );
    } catch (error) {
      this._adjustError(error);
      throw error;
    }
    this._adjustAllNodes(root);

    return root;
  }
}
