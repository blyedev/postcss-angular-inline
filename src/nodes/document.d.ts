import postcss from "postcss";
import { StyleRoot } from "./root.js";

export declare class Document extends postcss.Document {
  nodes: StyleRoot[];
}
