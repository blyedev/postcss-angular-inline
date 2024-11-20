import postcss, { CssSyntaxError } from "postcss";

/**
 * Represents a parser that adjusts the positions of nodes within the source code.
 */
export class StyleParser {
  /**
   * Constructs a new instance of the StyleParser class.
   *
   * @param {postcss.Input} input - The input source containing the style information.
   * @param {import("ts-morph").StringLiteral | import("ts-morph").NoSubstitutionTemplateLiteral} styleLiteral - The style literal node to be processed.
   */
  constructor(input, styleLiteral) {
    this.input = input;
    this.styleLiteral = styleLiteral;
  }

  /**
   * Modifies a position object to be relative to the input file instead of the parsed CSS.
   *
   * @param {postcss.Position | postcss.FilePosition | postcss.CssSyntaxError} object - The position object that requires adjustment.
   */
  _adjustPosition(object) {
    const { col, line } = this.input.fromOffset(this.styleLiteral.getStart());
    if (object) {
      if (object.line === 1) {
        object.column += col;
      }
      object.line += line - 1;
      if (typeof object.offset === "number") {
        object.offset += this.styleLiteral.getStart() + 1;
      }
      if (typeof object.endLine === "number") {
        if (object.endLine === 1) {
          object.endColumn += col;
        }
        object.endLine += line;
      }
    }
  }

  /**
   * Adjusts the positional data of a specific AST node to align with the input file's context.
   *
   * @param {postcss.AnyNode} node - The AST node whose position needs to be adjusted.
   */
  _adjustNode(node) {
    this._adjustPosition(node.source.start);
    this._adjustPosition(node.source.end);

    // End position on source is inclusive but the function is generic for both position and ranges
    node.source.end.column -= 1;
    node.source.end.offset -= 1;
  }

  /**
   * Updates the positions of all nodes within the provided root AST to correspond with the input file.
   *
   * @param {postcss.Root} root - The root node of the stylesheet AST that requires adjustment.
   */
  _adjustAllNodes(root) {
    this._adjustNode(root);
    root.walk((node) => {
      this._adjustNode(node);
    });
  }

  /**
   * Modifies error positions to reflect the context of the input file accurately.
   *
   * @param {CssSyntaxError} error - The error object that needs positional adjustment.
   * @returns {CssSyntaxError} The error object with updated position information.
   */
  _adjustError(error) {
    if (error && error.name === "CssSyntaxError") {
      this._adjustPosition(error);
      this._adjustPosition(error.input);
      error.message = error.message.replace(
        /:\d+:\d+:/,
        `:${error.line}:${error.column}:`,
      );
      error.source = this.input.css;
      error.input.source = this.input.css;
    }
    return error;
  }

  /**
   * Parses the style literal and generates the corresponding Abstract Syntax Tree (AST).
   *
   * @param {Pick<import("postcss").ProcessOptions, "from" | "map">} opts - The PostCSS processing options.
   * @returns {postcss.Root} The root node of the generated AST.
   * @throws Will throw an error if parsing fails, with adjusted error positions.
   */
  parse(opts) {
    const styleLiteral = this.styleLiteral;
    let root;
    try {
      root = postcss.parse(styleLiteral.getLiteralText(), opts);
    } catch (error) {
      this._adjustError(error);
      throw error;
    }

    this._adjustAllNodes(root);
    root.source = {
      ...root.source,
      input: this.input,
    };

    return root;
  }
}
