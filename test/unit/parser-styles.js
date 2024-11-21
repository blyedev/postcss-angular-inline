import { test } from "uvu";
import { getFixtureCode } from "../utils.js";
import { CssSyntaxError, Input } from "postcss";
import { equal, throws } from "uvu/assert";
import { parseTypescript } from "../../src/parser/parse-typescript.js";
import { StyleParser } from "../../src/parser/parser-styles.js";

const positionTestCases = [
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

positionTestCases.forEach(({ filename, sources }) => {
  const fixture = getFixtureCode(filename);

  test(`Ensure strings have correct position: ${fixture.filename}`, () => {
    const opts = { from: fixture.path };
    const input = new Input(fixture.code, opts);

    const styleLiterals = parseTypescript(input);

    styleLiterals.forEach((styleLiteral, idx) => {
      const styleParser = new StyleParser(input, styleLiteral);
      const styleNode = styleParser.parse(opts);
      equal(styleNode.source, { input, ...sources[idx] });
    });
  });
});

const syntaxErrFixture = getFixtureCode("syntax-error.component.ts");

test(`Ensure syntax error has correct position: ${syntaxErrFixture.filename}`, () => {
  const opts = { from: syntaxErrFixture.path };
  const input = new Input(syntaxErrFixture.code, opts);

  const styleLiterals = parseTypescript(input);

  const styleParser = new StyleParser(input, styleLiterals[0]);

  throws(
    () => styleParser.parse(opts),
    (/** @type {Error} */ err) => {
      if (!(err instanceof CssSyntaxError)) return false;

      const expectedPos = {
        file: syntaxErrFixture.path,
        line: 6,
        column: 22,
        endLine: 7,
        endColumn: 27,
        source: syntaxErrFixture.code,
      };

      const expectedInput = {
        url: "file:///home/blyedev/Projects/postcss-angular-inline/test/fixtures/syntax-error.component.ts",
        ...expectedPos,
      };
      const expectedErrorProperties = {
        name: "CssSyntaxError",
        reason: "Unknown word",
        ...expectedPos,
        input: expectedInput,
      };

      equal({ ...err }, { ...expectedErrorProperties });

      return true;
    },
  );
});

test.run();
