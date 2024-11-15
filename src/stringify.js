import { Document } from "postcss";

/**
 * Stringifies a PostCSS node, handling Document nodes specifically.
 * @param {import('postcss').AnyNode} node - The PostCSS node to stringify.
 * @param {import('postcss').Builder} builder - The builder function used for stringification.
 */
export default function stringify(node, builder) {
  if (!(node instanceof Document)) {
    builder(node.toString(), node);
    return;
  }

  if (node.nodes && node.nodes.length) {
    node.nodes.forEach((root) => {
      builder(root.raws.codeBefore, root);
      builder(root.toString(), root);
      builder(root.raws.codeAfter || "", root);
    });
  } else {
    builder(node.source.input.css, node);
  }
}
