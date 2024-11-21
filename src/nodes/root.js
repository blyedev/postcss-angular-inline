import * as postcss from "postcss";
import stringify from "../stringify.js";

/**
 * A customized PostCSS Root node with extended raw properties.
 *
 * @augments {postcss.Root}
 * @property {import("./types").StyleRaws} raws - Extended raw properties for StyleRoot.
 */
export class StyleRoot extends postcss.Root {
  /**
   * Creates an instance of StyleRoot.
   *
   * @class
   * @param {import("./root.js").StyleProps} options - Properties to initialize the StyleRoot instance.
   */
  constructor(options) {
    super(options);
  }

  /**
   * Compiles the node to a CSS string using the specified stringifier.
   *
   * @param {(postcss.Stringifier | postcss.Syntax)} [stringifier] - Optional stringifier to customize the output format.
   * @returns {string} The compiled CSS string of this node.
   */
  toString(stringifier) {
    return super.toString(
      stringifier || {
        stringify: stringify,
      },
    );
  }
}
