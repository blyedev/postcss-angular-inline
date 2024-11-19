import { test } from "uvu";
import { getFixtureCode } from "../utils.js";
import { TypescriptParser } from "../../src/parser-typescript.js";
import { Input } from "postcss";
import { StyleParser } from "../../src/parser-styles.js";
import { equal } from "uvu/assert";

const testCases = [
  {
    filename: "empty-style.component.ts",
    sources: [
      {
        start: {
          line: 6,
          column: 12,
          offset: 122,
        },
        end: {
          line: 6,
          column: 11,
          offset: 121,
        },
      },
    ],
  },
  {
    filename: "one-style.component.ts",
    sources: [
      {
        start: {
          line: 6,
          column: 12,
          offset: 122,
        },
        end: {
          line: 6,
          column: 35,
          offset: 145,
        },
      },
    ],
  },
  {
    filename: "multi-style.component.ts",
    sources: [
      {
        start: {
          line: 7,
          column: 6,
          offset: 128,
        },
        end: {
          line: 7,
          column: 29,
          offset: 151,
        },
      },
      {
        start: {
          line: 8,
          column: 6,
          offset: 160,
        },
        end: {
          line: 12,
          column: 4,
          offset: 215,
        },
      },
    ],
  },
];

testCases.forEach(({ filename, sources }) => {
  const fixture = getFixtureCode(filename);

  test(`Ensure strings have correct position: ${fixture.filename}`, () => {
    const opts = { from: fixture.path };
    const input = new Input(fixture.code, opts);

    const tsParser = new TypescriptParser(input);
    const styleLiterals = tsParser.parse();

    styleLiterals.forEach((styleLiteral, idx) => {
      const styleParser = new StyleParser(input, styleLiteral);
      const styleNode = styleParser.parse(opts);
      equal(styleNode.source, { input, ...sources[idx] });
    });
  });
});

test.run();
