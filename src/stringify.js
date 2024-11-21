import { Document } from "./nodes/document.js";
/**
 * Serializes a PostCSS node into its string representation.
 *
 * @param {import('postcss').AnyNode} node - The PostCSS node to be stringified.
 * @param {import('postcss').Builder} builder - The builder function responsible for handling the serialized output.
 * @returns {void} This function does not return a value; it utilizes the builder function for output.
 */
export default function stringify(node, builder) {
  if (!(node instanceof Document)) {
    builder(node.toString(), node);
    return;
  }

  if (node.nodes && node.nodes.length) {
    node.nodes.forEach((root) => {
      builder(root.raws.codeBefore, root);
      builder(root.raws.stringType, root);
      builder(root.toString(), root);
      builder(root.raws.stringType, root);
      if (root.raws.codeAfter) {
        builder(root.raws.codeAfter, root);
      }
    });
  } else {
    builder(node.source.input.css, node);
  }
}
