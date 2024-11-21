import * as postcss from "postcss";
import { stringify } from "../index.js";

/**
 * A customized PostCSS Document node.
 *
 * @augments {postcss.Document}
 */
export class Document extends postcss.Document {
  /**
   * It compiles the node to browser readable cascading style sheets string depending on it's type.
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
