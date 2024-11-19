import { test } from "uvu";
import * as assert from "uvu/assert";
import { getFixtureCode } from "../utils.js";
import { TypescriptParser } from "../../src/parser-typescript.js";
import { Input } from "postcss";

const testCases = [
  {
    filename: "no-style.component.ts",
    styles: [],
  },
  {
    filename: "empty-style.component.ts",
    styles: [""],
  },
  {
    filename: "one-style.component.ts",
    styles: [".example { color: red; }"],
  },
  {
    filename: "multi-style.component.ts",
    styles: [
      ".example { color: red; }",
      `
      .another {
        background: blue;
      }
    `,
    ],
  },
];

testCases.forEach(({ filename, styles }) => {
  const fixture = getFixtureCode(filename);

  test(`Parse the strings of fixture: ${fixture.filename}`, () => {
    const input = new Input(fixture.code, { from: fixture.path });

    const parser = new TypescriptParser(input);
    const result = parser.parse();

    assert.ok(result);
    assert.instance(result, Array);
    assert.equal(
      result.map((sl) => sl.getLiteralText()),
      styles,
    );
  });
});

test.run();
