import parse from "./parse.js";
import stringify from "./stringify.js";

export { parse, stringify };

const customSyntax = { parse, stringify };

export default customSyntax;
