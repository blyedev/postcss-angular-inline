import postcss, { CssSyntaxError } from "postcss";
import { StyleRoot } from "../nodes/root.js";

/**
 * Represents a parser that adjusts the positions of nodes within the source code.
 *
 * @abstract
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
   * @private
   * @param {postcss.Position | postcss.FilePosition | postcss.CssSyntaxError} object - The position object that requires adjustment.
   */
  adjustPosition(object) {
    const { col, line } = this.input.fromOffset(
      this.styleLiteral.getStart() + 1,
    );
    if (object) {
      if (object.line === 1) {
        object.column += col - 1;
      }
      object.line += line - 1;

      // Adjust 'offset' if it exists and is a number
      if ("offset" in object && typeof object.offset === "number") {
        object.offset += this.styleLiteral.getStart() + 1;
      }

      // Adjust 'endLine' and 'endColumn' if they exist
      if ("endLine" in object && typeof object.endLine === "number") {
        if (
          object.endLine === 1 &&
          "endColumn" in object &&
          typeof object.endColumn === "number"
        ) {
          object.endColumn += col - 1;
        }
        object.endLine += line;
      }
    }
  }

  /**
   * Adjusts the positional data of a specific AST node to align with the input file's context.
   *
   * @private
   * @param {postcss.AnyNode} node - The AST node whose position needs to be adjusted.
   */
  adjustNode(node) {
    this.adjustPosition(node.source.start);
    this.adjustPosition(node.source.end);

    // End position on source is inclusive but the function is generic for both position and ranges
    node.source.end.column -= 1;
    node.source.end.offset -= 1;
  }

  /**
   * Updates the positions of all nodes within the provided root AST to correspond with the input file.
   *
   * @private
   * @param {postcss.Root} root - The root node of the stylesheet AST that requires adjustment.
   */
  adjustAllNodes(root) {
    root.source.input = this.input;
    this.adjustNode(root);
    root.walk((node) => {
      this.adjustNode(node);
    });
  }

  /**
   * Modifies error positions to reflect the context of the input file accurately.
   *
   * @private
   * @param {CssSyntaxError} error - The error object that needs positional adjustment.
   * @returns {CssSyntaxError} The error object with updated position information.
   */
  adjustError(error) {
    if (error && error.name === "CssSyntaxError") {
      this.adjustPosition(error);
      this.adjustPosition(error.input);
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
   * @returns {StyleRoot} The root node of the generated AST.
   * @throws Will throw an error if parsing fails, with adjusted error positions.
   */
  parse(opts) {
    const styleText = this.styleLiteral.getLiteralText();
    let root;
    try {
      root = postcss.parse(styleText, Object.assign({}, opts, { map: false }));
    } catch (error) {
      this.adjustError(error);
      throw error;
    }

    this.adjustAllNodes(root);

    const quote = this.styleLiteral.getText().charAt(0);
    root.raws.stringType = quote;

    // @ts-ignore
    return root;
  }
}
